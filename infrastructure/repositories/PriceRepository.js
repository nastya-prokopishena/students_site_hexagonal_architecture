const Price = require('../../domain/models/price');

class PriceRepository {
  async findAll() {
    console.log('Querying all prices');
    try {
      const prices = await Price.findAll({
        attributes: ['price_id', 'price_amount'],
      });
      return prices.map(p => p.get({ plain: true }));
    } catch (error) {
      console.error('Error querying prices:', error.message, error.stack);
      throw error;
    }
  }

  async findByDormitoryId(dormitoryId) {
    console.log(`Querying price for dormitory ID ${dormitoryId}`);
    try {
      const Dormitory = require('../../domain/models/dormitory');
      const dormitory = await Dormitory.findOne({
        where: { dormitory_id: dormitoryId },
        include: [{ model: Price, attributes: ['price_amount'], as: 'Price', required: false }],
      });
      
      if (!dormitory) return null;
      
      return dormitory.Price ? dormitory.Price.get({ plain: true }) : null;
    } catch (error) {
      console.error('Error querying price:', error.message, error.stack);
      throw error;
    }
  }
}

module.exports = PriceRepository;