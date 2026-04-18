const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Hospital = require('../models/Hospital');
const Vaccine = require('../models/Vaccine');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const generateBookingReference = require('../utils/bookingRef');
const { reserveSlot, releaseSlot } = require('../services/slotService');
const { sendMail } = require('../config/mailer');

const getUserAge = (dateOfBirth) => {
  const diff = Date.now() - new Date(dateOfBirth).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

exports.getMyBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('hospitalId', 'name address city')
    .populate('vaccineId', 'name manufacturer')
    .sort({ createdAt: -1 });

  res.json({ status: 'success', results: bookings.length, data: { bookings } });
});

exports.getBookingById = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id })
    .populate('hospitalId', 'name address city')
    .populate('vaccineId', 'name manufacturer');
  if (!booking) return next(new AppError('Booking not found', 404));
  res.json({ status: 'success', data: { booking } });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
  }

  const { hospitalId, vaccineId, slotDate, doseNumber } = req.body;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) throw new AppError('Hospital not found', 404);
    const offering = hospital.vaccines.find((item) => item.vaccineId.equals(vaccineId));
    if (!offering) throw new AppError('Vaccine offering not found', 404);

    const vaccine = await Vaccine.findById(vaccineId);
    if (!vaccine) throw new AppError('Vaccine not found', 404);

    // Reserve slot synchronously
    await reserveSlot({ hospitalId, vaccineId, slotDate });

    const priceAtBooking = offering.price;
    const finalPrice = priceAtBooking;
    
    // Create new booking record
    const booking = await Booking.create({
      userId: req.user._id,
      hospitalId,
      vaccineId,
      slotDate,
      doseNumber,
      priceAtBooking,
      bookingReference: generateBookingReference(),
      patientDetails: {
        name: req.user.name,
        phone: req.user.phone,
        age: getUserAge(req.user.dateOfBirth),
      },
      finalPrice,
    });

    try {
      await sendMail({
        to: req.user.email,
        subject: 'Booking Confirmation',
        text: `Your booking ${booking.bookingReference} is confirmed. Hospital: ${hospital.name}, Date: ${new Date(slotDate).toLocaleDateString()}. Vaccine: ${vaccine.name}, Dose: ${doseNumber}, Price: ${finalPrice}`,
        html: `<p>Booking reference: <strong>${booking.bookingReference}</strong></p><p>Hospital: ${hospital.name}, ${hospital.address}</p><p>Date: ${new Date(slotDate).toLocaleDateString()}</p><p>Vaccine: ${vaccine.name}, Dose: ${doseNumber}</p><p>Price paid: ${finalPrice}</p>`,
      });
    } catch (mailErr) {
       console.log('Failed to send mail, Ethereal config missing or offline. Booking placed successfully.');
    }

    res.status(201).json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
});

exports.rescheduleBooking = catchAsync(async (req, res, next) => {
  const { slotDate } = req.body;
  if (!slotDate) return next(new AppError('slotDate is required for reschedule', 400));

  const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
  if (!booking) return next(new AppError('Booking not found', 404));
  if (booking.status !== 'CONFIRMED') return next(new AppError('Only confirmed bookings may be rescheduled', 400));

  try {
    const oldDate = booking.slotDate;
    const newDate = new Date(slotDate);
    newDate.setUTCHours(0, 0, 0, 0);

    if (oldDate.getTime() !== newDate.getTime()) {
      await releaseSlot({ hospitalId: booking.hospitalId, vaccineId: booking.vaccineId, slotDate: oldDate });
      await reserveSlot({ hospitalId: booking.hospitalId, vaccineId: booking.vaccineId, slotDate: newDate });
      booking.slotDate = newDate;
      await booking.save();
    }

    res.json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
  if (!booking) return next(new AppError('Booking not found', 404));
  if (booking.status !== 'CONFIRMED') return next(new AppError('Booking cannot be cancelled', 400));

  try {
    await releaseSlot({ hospitalId: booking.hospitalId, vaccineId: booking.vaccineId, slotDate: booking.slotDate });
    booking.status = 'CANCELLED';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();

    res.json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
});

exports.quickRebook = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
  if (!booking) return next(new AppError('Original booking not found', 404));

  const newDate = req.body.slotDate ? new Date(req.body.slotDate) : new Date();
  newDate.setUTCHours(0, 0, 0, 0);

  try {
    const hospital = await Hospital.findById(booking.hospitalId);
    if (!hospital) throw new AppError('Hospital not found', 404);
    const offering = hospital.vaccines.find((item) => item.vaccineId.equals(booking.vaccineId));
    if (!offering) throw new AppError('Vaccine offering not found', 404);

    await reserveSlot({ hospitalId: booking.hospitalId, vaccineId: booking.vaccineId, slotDate: newDate });

    const newBooking = await Booking.create({
      userId: req.user._id,
      hospitalId: booking.hospitalId,
      vaccineId: booking.vaccineId,
      slotDate: newDate,
      doseNumber: booking.doseNumber + 1,
      priceAtBooking: offering.price,
      bookingReference: generateBookingReference(),
      patientDetails: booking.patientDetails,
      finalPrice: offering.price,
    });

    res.status(201).json({ status: 'success', data: { booking: newBooking } });
  } catch (error) {
    next(error);
  }
});
