const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    vaccineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vaccine',
      required: true,
    },
    slotDate: {
      type: Date,
      required: true,
    },
    doseNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtBooking: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'],
      default: 'CONFIRMED',
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
    },
    patientDetails: {
      name: String,
      phone: String,
      age: Number,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    cancellationReason: String,
    cancelledAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ hospitalId: 1, slotDate: 1 });
bookingSchema.index({ bookingReference: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
