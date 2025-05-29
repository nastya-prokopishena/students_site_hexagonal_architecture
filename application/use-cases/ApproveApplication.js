class StudentManagement {
  constructor({ selectDataService }) {
    this.selectDataService = selectDataService;
  }

  async getFaculties() {
    try {
      return await this.selectDataService.getFaculties();
    } catch (error) {
      console.error('Error getting faculties:', error);
      throw error;
    }
  }

  async getSpecialties(facultyId) {
    try {
      return await this.selectDataService.getSpecialtiesByFaculty(facultyId);
    } catch (error) {
      console.error('Error getting specialties:', error);
      throw error;
    }
  }

  async getBenefits() {
    try {
      return await this.selectDataService.getBenefits();
    } catch (error) {
      console.error('Error getting benefits:', error);
      throw error;
    }
  }
}

module.exports = StudentManagement;