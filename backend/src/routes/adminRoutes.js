/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin booking management endpoints
 */
const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin'));
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id/complete', adminController.completeBooking);

module.exports = router;
