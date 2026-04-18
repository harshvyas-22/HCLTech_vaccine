const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const AppError = require('../utils/AppError');

exports.reserveSlot = async ({ hospitalId, vaccineId, slotDate }) => {
  const normalizedDate = new Date(slotDate);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  const doc = await Hospital.findById(hospitalId);
  if (!doc) throw new AppError('Hospital not found', 404);
  
  const vaccine = doc.vaccines.find(v => v.vaccineId.equals(vaccineId));
  if (!vaccine) throw new AppError('Vaccine not found', 404);
  
  const slot = vaccine.dailySlots.find(s => s.date.getTime() === normalizedDate.getTime());
  if (!slot || slot.booked >= slot.total) {
    throw new AppError('No slots available', 400);
  }

  const hospital = await Hospital.findOneAndUpdate(
    {
      _id: hospitalId,
      'vaccines.vaccineId': vaccineId,
      'vaccines.dailySlots.date': normalizedDate
    },
    {
      $inc: { 'vaccines.$[v].dailySlots.$[s].booked': 1 },
    },
    {
      arrayFilters: [
        { 'v.vaccineId': vaccineId }, 
        { 's.date': normalizedDate, 's.booked': { $lt: slot.total } }
      ],
      new: true,
    }
  );

  if (!hospital) {
    throw new AppError('No slots available', 400);
  }

  return hospital;
};

exports.releaseSlot = async ({ hospitalId, vaccineId, slotDate }) => {
  const normalizedDate = new Date(slotDate);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  const hospital = await Hospital.findOneAndUpdate(
    {
      _id: hospitalId,
      'vaccines.vaccineId': vaccineId,
      'vaccines.dailySlots': {
        $elemMatch: {
          date: normalizedDate,
          booked: { $gt: 0 },
        },
      },
    },
    {
      $inc: { 'vaccines.$[v].dailySlots.$[s].booked': -1 },
    },
    {
      arrayFilters: [{ 'v.vaccineId': vaccineId }, { 's.date': normalizedDate }],
      new: true,
    }
  );

  if (!hospital) {
    throw new AppError('Unable to release slot', 400);
  }

  return hospital;
};
