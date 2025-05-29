const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const StudentService = require('../../../application/services/StudentService');
const StudentRepository = require('../../../infrastructure/repositories/StudentRepository');

const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);
const studentController = new StudentController(studentService);

router.get('/fetch-select-data/faculties', studentController.getFaculties.bind(studentController));
router.get('/fetch-select-data/specialties/:facultyId', studentController.getSpecialties.bind(studentController));
router.get('/fetch-select-data/benefits', studentController.getBenefits.bind(studentController));
router.post('/submit_application', studentController.submitApplication.bind(studentController));
router.get('/dormitories/:id', studentController.getDormitory.bind(studentController));

module.exports = router;