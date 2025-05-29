const BenefitRepository = require('../../infrastructure/repositories/BenefitRepository');

class BenefitService {
  static async getBenefits() {
    console.log('Fetching all benefits');
    try {
      const benefits = await BenefitRepository.findAll();
      console.log('Benefits result:', benefits);
      return benefits;
    } catch (error) {
      console.error('Error in getBenefits:', error.message, error.stack);
      throw error;
    }
  }

  constructor(benefitRepository) {
    this.benefitRepository = benefitRepository;
  }

  async getBenefitById(id) {
    return await this.benefitRepository.findById(id);
  }

  async createBenefit(benefitData) {
    return await this.benefitRepository.create(benefitData);
  }
}

module.exports = BenefitService;
