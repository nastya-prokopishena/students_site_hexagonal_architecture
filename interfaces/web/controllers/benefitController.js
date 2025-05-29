const BenefitService = require('../../../application/services/BenefitService');

class BenefitController {
  static async getBenefits(req, res) {
    console.log('Handling GET /api/benefits');
    try {
      const benefits = await BenefitService.getBenefits();
      console.log('Benefits fetched:', benefits);
      res.json(benefits || []);
    } catch (error) {
      console.error('Error in getBenefits:', error.message, error.stack);
      res.status(500).json({ error: 'Помилка сервера: ' + error.message });
    }
  }
}

module.exports = BenefitController;