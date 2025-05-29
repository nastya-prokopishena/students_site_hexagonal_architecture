const FacultyService = require('../../../application/services/FacultyService');

class FacultyController {
  static async getFaculties(req, res) {
    console.log('Handling GET /api/fetch-select-data/faculties');
    try {
      const faculties = await FacultyService.getFaculties(); // Виклик статичного методу
      console.log('Faculties fetched:', faculties);
      res.json(faculties || []);
    } catch (error) {
      console.error('Error in getFaculties:', error.message, error.stack);
      res.status(500).json({ error: 'Помилка сервера: ' + error.message });
    }
  }
}

module.exports = FacultyController;