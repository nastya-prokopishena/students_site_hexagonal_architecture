const Benefit = require('../../infrastructure/database/models').Benefit;

class BenefitRepository {
  static async findAll() {
    return await Benefit.findAll({
      attributes: ['benefit_id', 'name']
    });
  }

  async findById(id) {
    return await Benefit.findByPk(id);
  }

  async create(benefitData) {
    return await Benefit.create(benefitData);
  }
}

module.exports = BenefitRepository;