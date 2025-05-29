const PriceRepository = require('../../infrastructure/repositories/PriceRepository');

class PriceService {
  constructor() {
    this.priceRepository = new PriceRepository();
  }

  async getPrices() {
    console.log('Fetching all prices');
    try {
      return await this.priceRepository.findAll();
    } catch (error) {
      console.error('Error in getPrices:', error.message, error.stack);
      throw error;
    }
  }

  async getPriceByDormitoryId(dormitoryId) {
    console.log(`Fetching price for dormitory ID ${dormitoryId}`);
    try {
      return await this.priceRepository.findByDormitoryId(dormitoryId);
    } catch (error) {
      console.error('Error in getPriceByDormitoryId:', error.message, error.stack);
      throw error;
    }
  }
}

module.exports = PriceService;