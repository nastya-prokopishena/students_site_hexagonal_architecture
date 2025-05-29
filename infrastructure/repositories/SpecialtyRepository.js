const Specialty = require('../../infrastructure/database/models').Specialty;

class SpecialtyRepository {
  static async findAll() {
    return await Specialty.findAll({
      attributes: ['specialty_id', 'name']
    });
  }

  async findById(id) {
    return await Specialty.findByPk(id);
  }

  async findByFacultyId(facultyId) {
    console.log('Fetching specialties for faculty_id:', facultyId);
    const specialties = await Specialty.findAll({
      where: { faculty_id: facultyId },
      attributes: ['specialty_id', 'name']
    });
    console.log('Specialties found:', specialties);
    return specialties;
  }
}

module.exports = SpecialtyRepository;