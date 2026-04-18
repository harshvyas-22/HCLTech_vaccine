/**
 * @swagger
 * tags:
 *   name: Hospitals
 *   description: Hospital search and management endpoints
 */
const express = require('express');
const { body } = require('express-validator');
const hospitalController = require('../controllers/hospitalController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', hospitalController.searchHospitals);
router.get('/nearby', hospitalController.getNearbyHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    body('name').notEmpty(),
    body('address').notEmpty(),
    body('city').notEmpty(),
    body('pincode').notEmpty(),
    body('state').notEmpty(),
    body('location.coordinates').isArray({ min: 2 }).withMessage('Location coordinates are required'),
    body('phone').notEmpty(),
    body('email').isEmail().withMessage('Valid email is required'),
    body('operatingHours.open').notEmpty(),
    body('operatingHours.close').notEmpty(),
  ],
  hospitalController.createHospital
);
router.put('/:id', protect, restrictTo('admin'), hospitalController.updateHospital);
router.delete('/:id', protect, restrictTo('admin'), hospitalController.deleteHospital);
router.post('/:id/vaccines', protect, restrictTo('admin'), hospitalController.addVaccineOffering);
router.put('/:id/vaccines/:vaccineId', protect, restrictTo('admin'), hospitalController.updateVaccinePrice);
router.post('/:id/vaccines/:vaccineId/slots', protect, restrictTo('admin'), hospitalController.setDailySlots);
router.get('/:id/vaccines/:vaccineId/slots', protect, restrictTo('admin'), hospitalController.getSlotCalendar);

module.exports = router;
