module.exports = class SubmitApplication {
  constructor(applicationRepository) {
    this.applicationRepository = applicationRepository;
  }

  async execute(applicationData) {
    const { faculty_id, specialty_id, benefit_id } = applicationData;

    if (!faculty_id || !specialty_id || !benefit_id) {
      throw new Error('Невірні або відсутні дані для створення заявки.');
    }

    const application = await this.applicationRepository.createApplication(applicationData);
    return application;
  }
};