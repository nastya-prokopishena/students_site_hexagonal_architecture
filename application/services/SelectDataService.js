const Faculty = require('../../domain/models/faculty');
const Specialty = require('../../domain/models/specialty');
const Benefit = require('../../domain/models/benefit');

class SelectDataService {
  static async getFaculties() {
    try {
      console.log('Fetching faculties');
      const faculties = await Faculty.findAll();
      console.log('Faculties fetched:', faculties.length);
      return faculties;
    } catch (error) {
      console.error('Error fetching faculties:', error.message, error.stack);
      throw error;
    }
  }

  static async getSpecialtiesByFacultyId(facultyId) {
    try {
      console.log(`Fetching specialties for faculty ID ${facultyId}`);
      const specialties = await Specialty.findAll({ where: { faculty_id: facultyId } });
      console.log('Specialties fetched:', specialties.length);
      return specialties;
    } catch (error) {
      console.error('Error fetching specialties:', error.message, error.stack);
      throw error;
    }
  }

  static async getBenefits() {
    try {
      console.log('Fetching benefits');
      const benefits = await Benefit.findAll();
      console.log('Benefits fetched:', benefits.length);
      return benefits;
    } catch (error) {
      console.error('Error fetching benefits:', error.message, error.stack);
      throw error;
    }
  }
}

module.exports = SelectDataService;