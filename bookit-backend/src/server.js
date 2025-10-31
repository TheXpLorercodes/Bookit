require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ============= MOCK DATA =============

const experiences = [
  {
    id: 'exp-001',
    title: 'Sunset Desert Safari',
    description: 'Experience the breathtaking beauty of the desert at sunset with dune bashing and camel rides.',
    location: 'Dubai, UAE',
    category: 'Adventure',
    pricePerPerson: 89.99,
    duration: '4 hours',
    maxCapacity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=600&fit=crop'
  },
  {
    id: 'exp-002',
    title: 'Hot Air Balloon Ride',
    description: 'Float above stunning landscapes and enjoy panoramic views from a hot air balloon.',
    location: 'Cappadocia, Turkey',
    category: 'Adventure',
    pricePerPerson: 199.99,
    duration: '3 hours',
    maxCapacity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
  },
  {
    id: 'exp-003',
    title: 'Snorkeling Adventure',
    description: 'Discover vibrant marine life and coral reefs in crystal-clear waters.',
    location: 'Great Barrier Reef, Australia',
    category: 'Water Sports',
    pricePerPerson: 129.99,
    duration: '5 hours',
    maxCapacity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
  },
  {
    id: 'exp-004',
    title: 'Mountain Trekking',
    description: 'Challenge yourself with a guided trek through spectacular mountain trails.',
    location: 'Swiss Alps, Switzerland',
    category: 'Adventure',
    pricePerPerson: 149.99,
    duration: '6 hours',
    maxCapacity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
  },
  {
    id: 'exp-005',
    title: 'Wine Tasting Tour',
    description: 'Sample exquisite wines and learn about winemaking at renowned vineyards.',
    location: 'Napa Valley, USA',
    category: 'Food & Drink',
    pricePerPerson: 79.99,
    duration: '3 hours',
    maxCapacity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&h=600&fit=crop'
  },
  {
    id: 'exp-006',
    title: 'Cooking Class Experience',
    description: 'Learn to cook authentic local cuisine with a professional chef.',
    location: 'Tuscany, Italy',
    category: 'Food & Drink',
    pricePerPerson: 99.99,
    duration: '4 hours',
    maxCapacity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop'
  },
  {
    id: 'exp-007',
    title: 'Northern Lights Tour',
    description: 'Witness the magical aurora borealis dancing across the Arctic sky.',
    location: 'Reykjavik, Iceland',
    category: 'Nature',
    pricePerPerson: 249.99,
    duration: '5 hours',
    maxCapacity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&h=600&fit=crop'
  },
  {
    id: 'exp-008',
    title: 'Safari Wildlife Tour',
    description: 'Observe majestic wildlife in their natural habitat on an exciting safari.',
    location: 'Serengeti, Tanzania',
    category: 'Nature',
    pricePerPerson: 299.99,
    duration: '8 hours',
    maxCapacity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop'
  },
  {
    id: 'exp-009',
    title: 'Surfing Lessons',
    description: 'Learn to ride the waves with professional instructors on beautiful beaches.',
    location: 'Bali, Indonesia',
    category: 'Water Sports',
    pricePerPerson: 69.99,
    duration: '2 hours',
    maxCapacity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&h=600&fit=crop'
  },
  {
    id: 'exp-010',
    title: 'Historical City Walking Tour',
    description: 'Explore ancient streets and discover fascinating stories of the past.',
    location: 'Rome, Italy',
    category: 'Culture',
    pricePerPerson: 39.99,
    duration: '3 hours',
    maxCapacity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop'
  }
];

const promoCodes = [
  { code: 'SAVE10', discountType: 'percentage', discountValue: 10, minAmount: 50 },
  { code: 'FLAT100', discountType: 'fixed', discountValue: 100, minAmount: 500 },
  { code: 'WELCOME20', discountType: 'percentage', discountValue: 20, minAmount: 100 }
];

let bookings = [];

// ============= ROUTES =============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all experiences
app.get('/api/experiences', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const paginatedExperiences = experiences.slice(offset, offset + parseInt(limit));

  res.json({
    experiences: paginatedExperiences,
    total: experiences.length,
    page: parseInt(page),
    totalPages: Math.ceil(experiences.length / limit)
  });
});

// Get single experience with mock slots
app.get('/api/experiences/:id', (req, res) => {
  const experience = experiences.find(e => e.id === req.params.id);

  if (!experience) {
    return res.status(404).json({ error: 'Experience not found' });
  }

  // Generate mock time slots for next 30 days
  const slots = [];
  const today = new Date();

  for (let day = 1; day <= 30; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];

    // Add morning, afternoon, evening slots
    slots.push({
      id: `slot-${req.params.id}-${day}-1`,
      experienceId: req.params.id,
      date: dateStr,
      startTime: '09:00',
      endTime: '12:00',
      availableSpots: Math.floor(Math.random() * experience.maxCapacity) + 1,
      totalSpots: experience.maxCapacity,
      isActive: true
    });

    slots.push({
      id: `slot-${req.params.id}-${day}-2`,
      experienceId: req.params.id,
      date: dateStr,
      startTime: '14:00',
      endTime: '17:00',
      availableSpots: Math.floor(Math.random() * experience.maxCapacity) + 1,
      totalSpots: experience.maxCapacity,
      isActive: true
    });

    if (day % 2 === 0) {
      slots.push({
        id: `slot-${req.params.id}-${day}-3`,
        experienceId: req.params.id,
        date: dateStr,
        startTime: '18:00',
        endTime: '21:00',
        availableSpots: Math.floor(Math.random() * experience.maxCapacity) + 1,
        totalSpots: experience.maxCapacity,
        isActive: true
      });
    }
  }

  res.json({
    experience: {
      ...experience,
      slots: slots.slice(0, 20) // Return first 20 slots
    }
  });
});

// Get slots for experience
app.get('/api/experiences/:id/slots', (req, res) => {
  const experience = experiences.find(e => e.id === req.params.id);

  if (!experience) {
    return res.status(404).json({ error: 'Experience not found' });
  }

  // Generate mock slots
  const slots = [];
  const today = new Date();

  for (let day = 1; day <= 30; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];

    slots.push({
      id: `slot-${req.params.id}-${day}-1`,
      date: dateStr,
      startTime: '09:00',
      endTime: '12:00',
      availableSpots: Math.floor(Math.random() * experience.maxCapacity) + 1,
      totalSpots: experience.maxCapacity
    });

    slots.push({
      id: `slot-${req.params.id}-${day}-2`,
      date: dateStr,
      startTime: '14:00',
      endTime: '17:00',
      availableSpots: Math.floor(Math.random() * experience.maxCapacity) + 1,
      totalSpots: experience.maxCapacity
    });
  }

  res.json({ slots });
});

// Validate promo code
app.post('/api/promo/validate', (req, res) => {
  const { code, booking_amount } = req.body;

  const promoCode = promoCodes.find(p => p.code === code.toUpperCase());

  if (!promoCode) {
    return res.json({ valid: false, message: 'Invalid promo code' });
  }

  if (booking_amount < promoCode.minAmount) {
    return res.json({
      valid: false,
      message: `Minimum booking amount of $${promoCode.minAmount} required`
    });
  }

  let discountAmount = 0;
  if (promoCode.discountType === 'percentage') {
    discountAmount = (booking_amount * promoCode.discountValue) / 100;
  } else {
    discountAmount = promoCode.discountValue;
  }

  res.json({
    valid: true,
    discountType: promoCode.discountType,
    discountValue: promoCode.discountValue,
    discountAmount,
    message: 'Promo code is valid'
  });
});

// Create booking (mock)
app.post('/api/bookings', (req, res) => {
  const {
    experience_id,
    slot_id,
    num_people,
    customer_name,
    customer_email,
    customer_phone,
    promo_code
  } = req.body;

  // Find experience
  const experience = experiences.find(e => e.id === experience_id);
  if (!experience) {
    return res.status(404).json({ error: 'Experience not found' });
  }

  // Calculate prices
  let totalAmount = experience.pricePerPerson * num_people;
  let discountAmount = 0;

  if (promo_code) {
    const promo = promoCodes.find(p => p.code === promo_code.toUpperCase());
    if (promo && totalAmount >= promo.minAmount) {
      if (promo.discountType === 'percentage') {
        discountAmount = (totalAmount * promo.discountValue) / 100;
      } else {
        discountAmount = promo.discountValue;
      }
    }
  }

  const finalAmount = totalAmount - discountAmount;

  // Create booking
  const booking = {
    id: `booking-${Date.now()}`,
    experienceId: experience_id,
    slotId: slot_id,
    numPeople: num_people,
    totalAmount,
    discountAmount,
    finalAmount,
    promoCode: promo_code || null,
    status: 'confirmed',
    customerName: customer_name,
    customerEmail: customer_email,
    customerPhone: customer_phone,
    createdAt: new Date(),
    experience,
    slot: {
      id: slot_id,
      date: '2024-12-20',
      startTime: '09:00',
      endTime: '12:00'
    }
  };

  bookings.push(booking);

  res.status(201).json({
    message: 'Booking created successfully',
    booking
  });
});

// Get booking
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json({ booking });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log('\n💡 Using MOCK DATA (no database needed)');
});