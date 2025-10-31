const { PromoCode } = require('../models');

// Validate promo code
exports.validatePromoCode = async (req, res) => {
  try {
    const { code, booking_amount } = req.body;

    const promoCode = await PromoCode.findOne({
      where: { 
        code: code.toUpperCase(),
        isActive: true 
      }
    });

    if (!promoCode) {
      return res.json({
        valid: false,
        message: 'Invalid promo code'
      });
    }

    const now = new Date();

    // Check validity period
    if (promoCode.validFrom && new Date(promoCode.validFrom) > now) {
      return res.json({
        valid: false,
        message: 'Promo code is not yet valid'
      });
    }

    if (promoCode.validUntil && new Date(promoCode.validUntil) < now) {
      return res.json({
        valid: false,
        message: 'Promo code has expired'
      });
    }

    // Check usage limit
    if (promoCode.maxUses && promoCode.timesUsed >= promoCode.maxUses) {
      return res.json({
        valid: false,
        message: 'Promo code usage limit reached'
      });
    }

    // Check minimum booking amount
    if (promoCode.minBookingAmount && booking_amount < parseFloat(promoCode.minBookingAmount)) {
      return res.json({
        valid: false,
        message: `Minimum booking amount of $${promoCode.minBookingAmount} required`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === 'percentage') {
      discountAmount = (booking_amount * parseFloat(promoCode.discountValue)) / 100;
    } else {
      discountAmount = parseFloat(promoCode.discountValue);
    }

    res.json({
      valid: true,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      discountAmount,
      message: 'Promo code is valid'
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to validate promo code',
      message: error.message 
    });
  }
};
