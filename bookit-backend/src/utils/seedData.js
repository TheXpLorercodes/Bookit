const { Experience, TimeSlot, PromoCode } = require('../models');
const sequelize = require('../config/database');

const sampleExperiences = [
  {
    title: 'Sunset Desert Safari',
    description: 'Experience the breathtaking beauty of the desert at sunset with dune bashing and camel rides.',
    location: 'Dubai, UAE',
    category: 'Adventure',
    pricePerPerson: 89.99,
    duration: '4 hours',
    maxCapacity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8'
  },
  {
    title: 'Hot Air Balloon Ride',
    description: 'Float above stunning landscapes and enjoy panoramic views from a hot air balloon.',
    location: 'Cappadocia, Turkey',
    category: 'Adventure',
    pricePerPerson: 199.99,
    duration: '3 hours',
    maxCapacity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
  },
  {
    title: 'Snorkeling Adventure',
    description: 'Discover vibrant marine life and coral reefs in crystal-clear waters.',
    location: 'Great Barrier Reef, Australia',
    category: 'Water Sports',
    pricePerPerson: 129.99,
    duration: '5 hours',
    maxCapacity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'
  },
  {
    title: 'Mountain Trekking',
    description: 'Challenge yourself with a guided trek through spectacular mountain trails.',
    location: 'Swiss Alps, Switzerland',
    category: 'Adventure',
    pricePerPerson: 149.99,
    duration: '6 hours',
    maxCapacity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
  },
  {
    title: 'Wine Tasting Tour',
    description: 'Sample exquisite wines and learn about winemaking at renowned vineyards.',
    location: 'Napa Valley, USA',
    category: 'Food & Drink',
    pricePerPerson: 79.99,
    duration: '3 hours',
    maxCapacity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1474722883778-792e7990302f'
  },
  {
    title: 'Cooking Class Experience',
    description: 'Learn to cook authentic local cuisine with a professional chef.',
    location: 'Tuscany, Italy',
    category: 'Food & Drink',
    pricePerPerson: 99.99,
    duration: '4 hours',
    maxCapacity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d'
  },
  {
    title: 'Northern Lights Tour',
    description: 'Witness the magical aurora borealis dancing across the Arctic sky.',
    location: 'Reykjavik, Iceland',
    category: 'Nature',
    pricePerPerson: 249.99,
    duration: '5 hours',
    maxCapacity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73'
  },
  {
    title: 'Safari Wildlife Tour',
    description: 'Observe majestic wildlife in their natural habitat on an exciting safari.',
    location: 'Serengeti, Tanzania',
    category: 'Nature',
    pricePerPerson: 299.99,
    duration: '8 hours',
    maxCapacity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801'
  },
  {
    title: 'Surfing Lessons',
    description: 'Learn to ride the waves with professional instructors on beautiful beaches.',
    location: 'Bali, Indonesia',
    category: 'Water Sports',
    pricePerPerson: 69.99,
    duration: '2 hours',
    maxCapacity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1502933691298-84fc14542831'
  },
  {
    title: 'Historical City Walking Tour',
    description: 'Explore ancient streets and discover fascinating stories of the past.',
    location: 'Rome, Italy',
    category: 'Culture',
    pricePerPerson: 39.99,
    duration: '3 hours',
    maxCapacity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5'
  }
];

const promoCodes = [
  {
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    minBookingAmount: 50,
    maxUses: 100,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    code: 'FLAT100',
    discountType: 'fixed',
    discountValue: 100,
    minBookingAmount: 500,
    maxUses: 50,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minBookingAmount: 100,
    maxUses: 200,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

const generateTimeSlots = (experienceId, capacity) => {
  const slots = [];
  const today = new Date();
  
  for (let day = 1; day <= 30; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    
    slots.push({
      experienceId,
      date: date.toISOString().split('T'),
      startTime: '09:00:00',
      endTime: '12:00:00',
      availableSpots: capacity,
      totalSpots: capacity,
      isActive: true
    });
    
    slots.push({
      experienceId,
      date: date.toISOString().split('T'),
      startTime: '14:00:00',
      endTime: '17:00:00',
      availableSpots: capacity,
      totalSpots: capacity,
      isActive: true
    });
    
    if (day % 2 === 0) {
      slots.push({
        experienceId,
        date: date.toISOString().split('T'),
        startTime: '18:00:00',
        endTime: '21:00:00',
        availableSpots: capacity,
        totalSpots: capacity,
        isActive: true
      });
    }
  }
  
  return slots;
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');
    
    console.log('📝 Creating experiences...');
    const experiences = await Experience.bulkCreate(sampleExperiences);
    console.log(`✅ Created ${experiences.length} experiences`);
    
    console.log('📅 Creating time slots...');
    let totalSlots = 0;
    for (const experience of experiences) {
      const slots = generateTimeSlots(experience.id, experience.maxCapacity);
      await TimeSlot.bulkCreate(slots);
      totalSlots += slots.length;
    }
    console.log(`✅ Created ${totalSlots} time slots`);
    
    console.log('🎟️  Creating promo codes...');
    await PromoCode.bulkCreate(promoCodes);
    console.log(`✅ Created ${promoCodes.length} promo codes`);
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\nAvailable Promo Codes:');
    promoCodes.forEach(promo => {
      console.log(`  - ${promo.code}: ${promo.discountType === 'percentage' ? promo.discountValue + '%' : '$' + promo.discountValue} off`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
