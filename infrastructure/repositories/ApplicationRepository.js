const { Application, Benefit, Faculty, Specialty } = require('../../infrastructure/database/models');
const { Sequelize } = require('sequelize');

class ApplicationRepository {
  async createApplication(applicationData) {
    console.log('Creating application with data:', applicationData);
    return await Application.create(applicationData);
  }

  async findAll(options) {
    return await Application.findAll({
      ...options,
      include: [
        { model: Benefit, attributes: ['name'], as: 'Benefit' },
        { model: Faculty, attributes: ['name'], as: 'Faculty' },
        { model: Specialty, attributes: ['name'], as: 'Specialty' },
      ],
      attributes: [
        'application_id',
        'first_name',
        'middle_name',
        'last_name',
        'date_of_birth',
        'home_address',
        'home_street_number',
        'home_campus_number',
        'home_city',
        'home_region',
        'phone_number',
        'email',
        [Sequelize.col('Benefit.name'), 'BenefitName'],
        [Sequelize.col('Faculty.name'), 'FacultyName'],
        [Sequelize.col('Specialty.name'), 'SpecialtyName'],
      ],
    });
  }

  async findById(id) {
    return await Application.findOne({ where: { application_id: id } });
  }

  async delete(id) {
    return await Application.destroy({ where: { application_id: id } });
  }
}

module.exports = ApplicationRepository;