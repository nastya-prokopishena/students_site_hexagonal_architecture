const Faculty = require('../../infrastructure/database/models').Faculty;

class FacultyRepository {
  static async findAll() {
    return await Faculty.findAll();
  }

  async findById(id) {
    return await Faculty.findByPk(id);
  }

  async create(facultyData) {
    return await Faculty.create(facultyData);
  }

  async update(id, facultyData) {
    const faculty = await Faculty.findByPk(id);
    if (!faculty) return null;
    return await faculty.update(facultyData);
  }

  async delete(id) {
    const faculty = await Faculty.findByPk(id);
    if (!faculty) return null;
    return await faculty.destroy();
  }
}

module.exports = FacultyRepository;