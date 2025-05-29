const SpecialtyRepository = require('../../infrastructure/repositories/SpecialtyRepository');

class SpecialtyService {
  constructor(specialtyRepository) {
    this.specialtyRepository = specialtyRepository;
  }

  static async getSpecialties() {
    console.log('Fetching all specialties');
    try {
      const specialties = await SpecialtyRepository.findAll();
      console.log('Specialties result:', specialties);
      return specialties;
    } catch (error) {
      console.error('Error in getSpecialties:', error.message, error.stack);
      throw error;
    }
  }

  async getSpecialtyById(id) {
    return await this.specialtyRepository.findById(id);
  }

  async getSpecialtiesByFaculty(facultyId) {
    console.log('Getting specialties for faculty:', facultyId); // Додати лог
    return await this.specialtyRepository.findByFacultyId(facultyId);
  }
}

module.exports = SpecialtyService;