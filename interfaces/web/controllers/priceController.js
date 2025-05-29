const PriceService = require('../../../application/services/PriceService');

class PriceController {
  static async getPrices(req, res) {
    try {
      const service = new PriceService();
      const prices = await service.getPrices();
      res.json(prices);
    } catch (error) {
      console.error('Error in getPrices:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        details: error.message 
      });
    }
  }
}

module.exports = PriceController;