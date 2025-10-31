const { Booking, TimeSlot, Experience, PromoCode } = require('../models');
const sequelize = require('../config/database');

// Create booking with transaction and row-level locking
exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      experience_id,
      slot_id,
      num_people,
      customer_name,
      customer_email,
      customer_phone,
      promo_code
    } = req.body;

    // STEP 1: Lock the slot row for update (prevents double-booking)
    const slot = await TimeSlot.findOne({
      where: { id: slot_id, experience_id },
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!slot) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Time slot not found' });
    }

    // STEP 2: Check availability
    if (slot.availableSpots < num_people) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Not enough spots available',
        availableSpots: slot.availableSpots
      });
    }

    if (!slot.isActive) {
      await transaction.rollback();
      return res.status(400).json({ error: 'This time slot is no longer active' });
    }

    // STEP 3: Get experience details
    const experience = await Experience.findByPk(experience_id, { transaction });

    if (!experience) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Experience not found' });
    }

    // STEP 4: Calculate pricing
    let totalAmount = parseFloat(experience.pricePerPerson) * num_people;
    let discountAmount = 0;

    // STEP 5: Validate and apply promo code
    if (promo_code) {
      const promoCodeData = await PromoCode.findOne({
        where: { 
          code: promo_code.toUpperCase(),
          isActive: true 
        },
        lock: transaction.LOCK.UPDATE,
        transaction
      });

      if (promoCodeData) {
        const now = new Date();
        
        // Check validity period
        if (promoCodeData.validFrom && new Date(promoCodeData.validFrom) > now) {
          await transaction.rollback();
          return res.status(400).json({ error: 'Promo code is not yet valid' });
        }
        
        if (promoCodeData.validUntil && new Date(promoCodeData.validUntil) < now) {
          await transaction.rollback();
          return res.status(400).json({ error: 'Promo code has expired' });
        }

        // Check usage limit
        if (promoCodeData.maxUses && promoCodeData.timesUsed >= promoCodeData.maxUses) {
          await transaction.rollback();
          return res.status(400).json({ error: 'Promo code usage limit reached' });
        }

        // Check minimum booking amount
        if (promoCodeData.minBookingAmount && totalAmount < parseFloat(promoCodeData.minBookingAmount)) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: `Minimum booking amount of $${promoCodeData.minBookingAmount} required for this promo code` 
          });
        }

        // Calculate discount
        if (promoCodeData.discountType === 'percentage') {
          discountAmount = (totalAmount * parseFloat(promoCodeData.discountValue)) / 100;
        } else {
          discountAmount = parseFloat(promoCodeData.discountValue);
        }

        // Increment promo code usage
        await promoCodeData.increment('timesUsed', { transaction });
      }
    }

    const finalAmount = totalAmount - discountAmount;

    // STEP 6: Create booking
    const booking = await Booking.create({
      experienceId: experience_id,
      slotId: slot_id,
      numPeople: num_people,
      totalAmount,
      discountAmount,
      finalAmount,
      promoCode: promo_code ? promo_code.toUpperCase() : null,
      customerName: customer_name,
      customerEmail: customer_email,
      customerPhone: customer_phone,
      status: 'confirmed'
    }, { transaction });

    // STEP 7: Decrement available spots
    await slot.decrement('availableSpots', { 
      by: num_people, 
      transaction 
    });

    // Commit transaction
    await transaction.commit();

    // Fetch complete booking data
    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Experience, as: 'experience' },
        { model: TimeSlot, as: 'slot' }
      ]
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: completeBooking
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Booking error:', error);
    res.status(500).json({ 
      error: 'Failed to create booking',
      message: error.message 
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        { model: Experience, as: 'experience' },
        { model: TimeSlot, as: 'slot' }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch booking',
      message: error.message 
    });
  }
};
