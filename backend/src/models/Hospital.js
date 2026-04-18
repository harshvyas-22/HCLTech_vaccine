const mongoose = require('mongoose');

const dailySlotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    booked: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const hospitalVaccineSchema = new mongoose.Schema(
  {
    vaccineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vaccine',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    dailySlots: [dailySlotSchema],
  },
  { _id: false }
);

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Location coordinates are required'],
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    operatingHours: {
      open: { type: String, required: true },
      close: { type: String, required: true },
    },
    facilities: [String],
    images: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vaccines: [hospitalVaccineSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

hospitalSchema.index({ name: 'text', city: 'text', address: 'text' });
hospitalSchema.index({ pincode: 1 });
hospitalSchema.index({ city: 1 });
hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
