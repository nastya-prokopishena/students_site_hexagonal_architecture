const { Sequelize } = require('sequelize');
const { Benefit, Faculty, Specialty } = require('../../infrastructure/database/models');
const SubmitApplication = require('../use-cases/SubmitApplication');
const sequelize = require('../../infrastructure/database/sequelize');

class ApplicationService {
  constructor(applicationRepository) {
    this.submitApplication = new SubmitApplication(applicationRepository);
    this.applicationRepository = applicationRepository;
  }

  async submit(applicationData) {
    return this.submitApplication.execute(applicationData);
  }

  async getAllApplications() {
    return await this.applicationRepository.findAll({
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

  async getApplicationById(id) {
    return await this.applicationRepository.findById(id);
  }

  async deleteApplication(id) {
    return await this.applicationRepository.delete(id);
  }
}

module.exports = ApplicationService;