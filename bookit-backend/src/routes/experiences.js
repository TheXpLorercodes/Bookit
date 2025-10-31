const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');

router.get('/', experienceController.getAllExperiences);
router.get('/:id', experienceController.getExperienceById);
router.get('/:id/slots', experienceController.getExperienceSlots);

module.exports = router;
