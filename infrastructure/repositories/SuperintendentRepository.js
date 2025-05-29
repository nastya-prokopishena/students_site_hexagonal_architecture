const Superintendent = require('../../domain/models/superintendent');

class SuperintendentRepository {
  async findByEmail(email) {
    return await Superintendent.findOne({ where: { email } });
  }
}

module.exports = SuperintendentRepository;