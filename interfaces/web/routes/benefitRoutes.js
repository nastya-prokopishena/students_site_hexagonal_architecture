const express = require('express');
const BenefitController = require('../controllers/benefitController');

const router = express.Router();

router.get('/benefits', BenefitController.getBenefits);

module.exports = router;