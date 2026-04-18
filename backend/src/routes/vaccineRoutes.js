/**
 * @swagger
 * tags:
 *   name: Vaccines
 *   description: Vaccine management endpoints
 */
const express = require('express');
const { body } = require('express-validator');
const vaccineController = require('../controllers/vaccineController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', vaccineController.getAllVaccines);
router.get('/:id', vaccineController.getVaccineById);
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('manufacturer').notEmpty().withMessage('Manufacturer is required'),
    body('recommendedDoses').isInt({ min: 1 }).withMessage('Recommended doses must be at least 1'),
    body('minAge').isInt({ min: 0 }).withMessage('minAge is required'),
    body('maxAge').isInt({ min: 0 }).withMessage('maxAge is required'),
    body('gapBetweenDoses').isInt({ min: 0 }).withMessage('gapBetweenDoses is required'),
  ],
  vaccineController.createVaccine
);
router.put('/:id', protect, restrictTo('admin'), vaccineController.updateVaccine);
router.delete('/:id', protect, restrictTo('admin'), vaccineController.deleteVaccine);

module.exports = router;
