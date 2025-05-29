const express = require('express');
const FacultyController = require('../controllers/facultyController');

const router = express.Router();

router.get('/fetch-select-data/faculties', FacultyController.getFaculties);

module.exports = router;