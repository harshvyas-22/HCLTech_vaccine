/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Patient booking endpoints
 */
const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { bookingLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.use(protect, restrictTo('patient'));
router.get('/my', bookingController.getMyBookings);
router.get('/:id', bookingController.getBookingById);
router.post(
  '/',
  bookingLimiter,
  [
    body('hospitalId').notEmpty().withMessage('Hospital ID is required'),
    body('vaccineId').notEmpty().withMessage('Vaccine ID is required'),
    body('slotDate').isISO8601().toDate().withMessage('Slot date is required'),
    body('doseNumber').isInt({ min: 1 }).withMessage('Dose number is required'),
  ],
  bookingController.createBooking
);
router.put('/:id', [body('slotDate').isISO8601().toDate().withMessage('slotDate is required')], bookingController.rescheduleBooking);
router.delete('/:id', bookingController.cancelBooking);
router.post('/:id/rebook', bookingController.quickRebook);

module.exports = router;
