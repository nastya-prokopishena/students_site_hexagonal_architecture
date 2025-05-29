const express = require('express');
const SpecialtyController = require('../controllers/specialtyController');

const router = express.Router();

router.get('/specialties', SpecialtyController.getSpecialties);
router.get('/specialties/:facultyId', SpecialtyController.getSpecialtiesByFaculty);
module.exports = router;