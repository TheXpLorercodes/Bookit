const { Experience, TimeSlot } = require('../models');
const { Op } = require('sequelize');

// Get all experiences with pagination
exports.getAllExperiences = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Experience.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      experiences: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch experiences',
      message: error.message 
    });
  }
};

// Get single experience with available slots
exports.getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findByPk(id, {
      include: [{
        model: TimeSlot,
        as: 'slots',
        where: {
          date: { [Op.gte]: new Date().toISOString().split('T') },
          availableSpots: { [Op.gt]: 0 },
          isActive: true
        },
        required: false,
        order: [['date', 'ASC'], ['startTime', 'ASC']]
      }]
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({ experience });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch experience',
      message: error.message 
    });
  }
};

// Get available slots for an experience
exports.getExperienceSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, month } = req.query;

    const whereClause = {
      experienceId: id,
      availableSpots: { [Op.gt]: 0 },
      isActive: true
    };

    if (date) {
      whereClause.date = date;
    } else if (month) {
      const startDate = new Date(month + '-01');
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    } else {
      whereClause.date = { [Op.gte]: new Date().toISOString().split('T') };
    }

    const slots = await TimeSlot.findAll({
      where: whereClause,
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });

    res.json({ slots });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch slots',
      message: error.message 
    });
  }
};
