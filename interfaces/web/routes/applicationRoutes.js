const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/applications/submit', applicationController.submitApplication);
router.get('/applications', applicationController.getAllApplications);
router.post('/accept_application', applicationController.acceptApplication);
router.delete('/reject_application/:application_id', applicationController.rejectApplication);

module.exports = router;