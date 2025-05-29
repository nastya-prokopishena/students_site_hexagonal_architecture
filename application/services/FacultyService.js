const FacultyRepository = require('../../infrastructure/repositories/FacultyRepository');

class FacultyService {
  constructor(facultyRepository) {
    this.facultyRepository = facultyRepository;
  }

  static async getFaculties() {
    console.log('Fetching all faculties');
    try {
      const faculties = await FacultyRepository.findAll();
      console.log('Faculties result:', faculties);
      return faculties;
    } catch (error) {
      console.error('Error in getFaculties:', error.message, error.stack);
      throw error;
    }
  }

  async getFacultyById(id) {
    return await this.facultyRepository.findById(id);
  }

  async createFaculty(facultyData) {
    return await this.facultyRepository.create(facultyData);
  }

  async updateFaculty(id, facultyData) {
    return await this.facultyRepository.update(id, facultyData);
  }

  async deleteFaculty(id) {
    return await this.facultyRepository.delete(id);
  }
}

module.exports = FacultyService;