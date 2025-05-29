const express = require('express');
const PriceController = require('../controllers/priceController');

const router = express.Router();

router.get('/prices', PriceController.getPrices);

module.exports = router;