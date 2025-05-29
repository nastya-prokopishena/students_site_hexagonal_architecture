const { Op } = require('sequelize');

class StudentService {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async createStudent(studentData) {
    return await this.studentRepository.create(studentData);
  }

  async getAllStudents({ where = {}, include = [] } = {}) {
    return await this.studentRepository.findAll({ where, include });
  }

}

module.exports = StudentService;