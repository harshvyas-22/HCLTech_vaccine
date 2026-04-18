const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllBookings = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
  if (req.query.date) {
    const date = new Date(req.query.date);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.slotDate = { $gte: date, $lt: nextDay };
  }

  const bookings = await Booking.find(filter)
    .populate('userId', 'name email phone')
    .populate('hospitalId', 'name city')
    .populate('vaccineId', 'name')
    .sort({ createdAt: -1 });

  res.json({ status: 'success', results: bookings.length, data: { bookings } });
});

exports.completeBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return next(new AppError('Booking not found', 404));
  booking.status = 'COMPLETED';
  booking.completedAt = new Date();
  await booking.save();
  res.json({ status: 'success', data: { booking } });
});
