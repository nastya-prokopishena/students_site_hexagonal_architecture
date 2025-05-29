const SpecialtyService = require('../../../application/services/SpecialtyService');
const SpecialtyRepository = require('../../../infrastructure/repositories/SpecialtyRepository');

const specialtyRepository = new SpecialtyRepository();
const specialtyService = new SpecialtyService(specialtyRepository);

class SpecialtyController {
  static async getSpecialties(req, res) {
    console.log('Handling GET /api/specialties');
    try {
      const specialties = await SpecialtyService.getSpecialties();
      console.log('Specialties fetched:', specialties);
      res.json(specialties || []);
    } catch (error) {
      console.error('Error in getSpecialties:', error.message, error.stack);
      res.status(500).json({ error: 'Помилка сервера: ' + error.message });
    }
  }

  static async getSpecialtiesByFaculty(req, res) {
    console.log('Handling GET /api/specialties/:facultyId');
    try {
      const facultyId = parseInt(req.params.facultyId, 10);
      console.log('Faculty ID:', facultyId);
      const specialties = await specialtyService.getSpecialtiesByFaculty(facultyId);
      console.log('Specialties fetched for faculty:', specialties);
      res.json(specialties || []);
    } catch (error) {
      console.error('Error in getSpecialtiesByFaculty:', error.message, error.stack);
      res.status(500).json({ error: 'Помилка сервера: ' + error.message });
    }
  }
}

module.exports = SpecialtyController;