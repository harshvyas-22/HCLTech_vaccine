const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vaccine name is required'],
      unique: true,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    recommendedDoses: {
      type: Number,
      required: true,
      min: 1,
    },
    minAge: {
      type: Number,
      required: true,
      min: 0,
    },
    maxAge: {
      type: Number,
      required: true,
      min: 0,
    },
    gapBetweenDoses: {
      type: Number,
      required: true,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

vaccineSchema.index({ name: 1 }, { unique: true });
vaccineSchema.index({ name: 'text', manufacturer: 'text' });

module.exports = mongoose.model('Vaccine', vaccineSchema);
