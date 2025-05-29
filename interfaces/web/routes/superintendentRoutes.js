const express = require('express');
const router = express.Router();
const SuperintendentController = require('../controllers/superintendentController');
const SuperintendentService = require('../../../application/services/SuperintendentService');
const redisClient = require('../../../infrastructure/database/redis');

// Instantiate controller with dependencies
const superintendentController = new SuperintendentController(new SuperintendentService(), redisClient);

// Define routes
router.get('/applications', superintendentController.getApplications.bind(superintendentController));
router.get('/residents', superintendentController.getResidents.bind(superintendentController));
router.post('/accept_application', superintendentController.acceptApplication.bind(superintendentController));
router.delete('/reject_application/:application_id', superintendentController.rejectApplication.bind(superintendentController));
router.post('/login', superintendentController.login.bind(superintendentController));
router.post('/search_students', superintendentController.searchStudents.bind(superintendentController));

module.exports = router;