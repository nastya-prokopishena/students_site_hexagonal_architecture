const express = require('express');
const router = express.Router();

module.exports = (selectDataController) => {
  router.get('/faculties', selectDataController.getFaculties.bind(selectDataController));
  router.get('/specialties/:facultyId', selectDataController.getSpecialties.bind(selectDataController));
  router.get('/benefits', selectDataController.getBenefits.bind(selectDataController));
  
  return router;
};