const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const promoController = require('../controllers/promoController');

const validatePromoCode = [
  body('code').notEmpty().isLength({ min: 3, max: 50 }).withMessage('Valid promo code required'),
  body('booking_amount').notEmpty().isFloat({ min: 0 }).withMessage('Valid booking amount required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/validate', validatePromoCode, promoController.validatePromoCode);

module.exports = router;
