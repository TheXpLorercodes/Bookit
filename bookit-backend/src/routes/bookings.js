const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bookingController = require('../controllers/bookingController');

// Validation middleware
const validateBooking = [
  body('experience_id').notEmpty().isUUID().withMessage('Valid experience ID required'),
  body('slot_id').notEmpty().isUUID().withMessage('Valid slot ID required'),
  body('num_people').notEmpty().isInt({ min: 1 }).withMessage('Valid number of people required'),
  body('customer_name').notEmpty().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('customer_email').notEmpty().isEmail().withMessage('Valid email required'),
  body('customer_phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/', validateBooking, bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);

module.exports = router;
