const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
  }

  const { name, email, password, phone, dateOfBirth } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('Email already registered', 400));
  }

  const user = await User.create({ name, email, password, phone, dateOfBirth });
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array().map((err) => err.msg).join(', '), 400));
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = signToken(user._id);
  res.json({
    status: 'success',
    token,
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
  });
});

exports.logout = (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
};

exports.getMe = (req, res) => {
  const user = req.user;
  res.json({
    status: 'success',
    data: { user },
  });
};
