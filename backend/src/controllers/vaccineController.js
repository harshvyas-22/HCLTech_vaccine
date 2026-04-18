const { validationResult } = require('express-validator');
const Vaccine = require('../models/Vaccine');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllVaccines = catchAsync(async (req, res) => {
  const vaccines = await Vaccine.find();
  res.json({ status: 'success', results: vaccines.length, data: { vaccines } });
});

exports.getVaccineById = catchAsync(async (req, res, next) => {
  const vaccine = await Vaccine.findById(req.params.id);
  if (!vaccine) {
    return next(new AppError('Vaccine not found', 404));
  }
  res.json({ status: 'success', data: { vaccine } });
});

exports.createVaccine = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
  }

  const vaccine = await Vaccine.create(req.body);
  res.status(201).json({ status: 'success', data: { vaccine } });
});

exports.updateVaccine = catchAsync(async (req, res, next) => {
  const vaccine = await Vaccine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!vaccine) {
    return next(new AppError('Vaccine not found', 404));
  }
  res.json({ status: 'success', data: { vaccine } });
});

exports.deleteVaccine = catchAsync(async (req, res, next) => {
  const vaccine = await Vaccine.findByIdAndDelete(req.params.id);
  if (!vaccine) {
    return next(new AppError('Vaccine not found', 404));
  }
  res.status(204).json({ status: 'success', data: null });
});
