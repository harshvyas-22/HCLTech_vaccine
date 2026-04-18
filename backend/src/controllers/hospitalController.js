const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const Vaccine = require('../models/Vaccine');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const buildSearchQuery = (query) => {
  const filter = { isActive: true };
  if (query.city) {
    filter.city = { $regex: query.city, $options: 'i' };
  }
  if (query.pincode) {
    filter.pincode = query.pincode;
  }
  if (query.name) {
    filter.$text = { $search: query.name };
  }
  if (query.vaccineId) {
    filter['vaccines.vaccineId'] = query.vaccineId;
  }
  if (query.minPrice || query.maxPrice) {
    filter['vaccines.price'] = {};
    if (query.minPrice) filter['vaccines.price'].$gte = Number(query.minPrice);
    if (query.maxPrice) filter['vaccines.price'].$lte = Number(query.maxPrice);
  }
  if (query.date) {
    const date = new Date(query.date);
    date.setUTCHours(0, 0, 0, 0);
    filter['vaccines.dailySlots'] = {
      $elemMatch: { date },
    };
  }
  return filter;
};

exports.searchHospitals = catchAsync(async (req, res) => {
  const filter = buildSearchQuery(req.query);
  const hospitals = await Hospital.find(filter)
    .populate('vaccines.vaccineId', 'name manufacturer')
    .lean();

  res.json({ status: 'success', results: hospitals.length, data: { hospitals } });
});

exports.getNearbyHospitals = catchAsync(async (req, res, next) => {
  const { lat, lng, radius, vaccineId, minPrice, maxPrice } = req.query;
  if (!lat || !lng || !radius) {
    return next(new AppError('lat, lng and radius are required', 400));
  }

  const shape = {
    type: 'Point',
    coordinates: [Number(lng), Number(lat)],
  };

  const filter = { isActive: true, 'location': { $exists: true } };
  if (vaccineId) filter['vaccines.vaccineId'] = vaccineId;
  if (minPrice || maxPrice) {
    filter['vaccines.price'] = {};
    if (minPrice) filter['vaccines.price'].$gte = Number(minPrice);
    if (maxPrice) filter['vaccines.price'].$lte = Number(maxPrice);
  }

  const hospitals = await Hospital.aggregate([
    {
      $geoNear: {
        near: shape,
        distanceField: 'distance',
        spherical: true,
        maxDistance: Number(radius),
        query: filter,
      },
    },
    { $limit: 100 },
  ]);

  res.json({ status: 'success', results: hospitals.length, data: { hospitals } });
});

exports.getHospitalById = catchAsync(async (req, res, next) => {
  const hospital = await Hospital.findById(req.params.id).populate('vaccines.vaccineId', 'name manufacturer');
  if (!hospital) {
    return next(new AppError('Hospital not found', 404));
  }
  res.json({ status: 'success', data: { hospital } });
});

exports.createHospital = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
  }
  const data = { ...req.body, createdBy: req.user._id };
  if (data.location && Array.isArray(data.location.coordinates)) {
    data.location.type = 'Point';
  }
  const hospital = await Hospital.create(data);
  res.status(201).json({ status: 'success', data: { hospital } });
});

exports.updateHospital = catchAsync(async (req, res, next) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    return next(new AppError('Hospital not found', 404));
  }
  if (req.body.location && Array.isArray(req.body.location.coordinates)) {
    req.body.location.type = 'Point';
  }
  Object.assign(hospital, req.body);
  await hospital.save();
  res.json({ status: 'success', data: { hospital } });
});

exports.deleteHospital = catchAsync(async (req, res, next) => {
  const hospital = await Hospital.findByIdAndDelete(req.params.id);
  if (!hospital) {
    return next(new AppError('Hospital not found', 404));
  }
  res.status(204).json({ status: 'success', data: null });
});

exports.addVaccineOffering = catchAsync(async (req, res, next) => {
  const { vaccineId, price } = req.body;
  if (!vaccineId || price == null) {
    return next(new AppError('vaccineId and price are required', 400));
  }
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) return next(new AppError('Hospital not found', 404));
  const vaccine = await Vaccine.findById(vaccineId);
  if (!vaccine) return next(new AppError('Vaccine not found', 404));

  const existing = hospital.vaccines.find((item) => item.vaccineId.equals(vaccineId));
  if (existing) {
    existing.price = price;
  } else {
    hospital.vaccines.push({ vaccineId, price, dailySlots: [] });
  }
  await hospital.save();
  res.status(201).json({ status: 'success', data: { hospital } });
});

exports.updateVaccinePrice = catchAsync(async (req, res, next) => {
  const { price } = req.body;
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) return next(new AppError('Hospital not found', 404));
  const offering = hospital.vaccines.find((item) => item.vaccineId.equals(req.params.vaccineId));
  if (!offering) return next(new AppError('Vaccine offering not found', 404));
  if (price == null) return next(new AppError('Price is required', 400));
  offering.price = price;
  await hospital.save();
  res.json({ status: 'success', data: { hospital } });
});

exports.setDailySlots = catchAsync(async (req, res, next) => {
  const { date, total } = req.body;
  if (!date || total == null) {
    return next(new AppError('date and total are required', 400));
  }
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) return next(new AppError('Hospital not found', 404));
  const offering = hospital.vaccines.find((item) => item.vaccineId.equals(req.params.vaccineId));
  if (!offering) return next(new AppError('Vaccine offering not found', 404));

  const slotDate = new Date(date);
  slotDate.setUTCHours(0, 0, 0, 0);
  const slot = offering.dailySlots.find((item) => item.date.getTime() === slotDate.getTime());
  if (slot) {
    slot.total = total;
  } else {
    offering.dailySlots.push({ date: slotDate, total, booked: 0 });
  }
  await hospital.save();
  res.status(201).json({ status: 'success', data: { dailySlots: offering.dailySlots } });
});

exports.getSlotCalendar = catchAsync(async (req, res, next) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) return next(new AppError('Hospital not found', 404));
  const offering = hospital.vaccines.find((item) => item.vaccineId.equals(req.params.vaccineId));
  if (!offering) return next(new AppError('Vaccine offering not found', 404));
  res.json({ status: 'success', data: { dailySlots: offering.dailySlots } });
});
