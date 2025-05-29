const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { Student, StudentOccupancy, Room, Dormitory } = require('../../infrastructure/database/models');
const AssignRoom = require('../use-cases/AssignRoom');
const ApplicationService = require('./ApplicationService');
const StudentService = require('./StudentService');
const DormitoryService = require('./DormitoryService');
const SuperintendentRepository = require('../../infrastructure/repositories/SuperintendentRepository');
const ApplicationRepository = require('../../infrastructure/repositories/ApplicationRepository');
const StudentRepository = require('../../infrastructure/repositories/StudentRepository');
const DormitoryRepository = require('../../infrastructure/repositories/DormitoryRepository');

class SuperintendentService {
  constructor() {
    this.applicationService = new ApplicationService(new ApplicationRepository());
    this.studentService = new StudentService(new StudentRepository());
    this.dormitoryService = new DormitoryService(new DormitoryRepository());
    this.superintendentRepository = new SuperintendentRepository();
    this.assignRoom = new AssignRoom(this.studentService, this.dormitoryService);
  }

  async getAllApplications() {
    return await this.applicationService.getAllApplications();
  }

  async fetchStudentsWithOccupancies() {
    return await Student.findAll({
      attributes: ['student_id', 'first_name', 'middle_name', 'last_name', 'date_of_birth'],
      include: [{
        model: StudentOccupancy,
        as: 'Occupancies',
        attributes: ['occupancy_id', 'student_id', 'dormitory_id', 'room_id', 'lease_start_date', 'lease_term', 'lease_end_date', 'benefit_id'],
        include: [{
          model: Room,
          as: 'Room',
          attributes: ['room_id', 'room_number'],
          include: [{
            model: Dormitory,
            as: 'Dormitory',
            attributes: ['dormitory_id', 'name'],
          }],
        }],
      }],
    });
  }

  formatResidentData(student) {
    const occupancy = student.Occupancies && student.Occupancies[0];
    const room = occupancy && occupancy.Room;
    const dormitory = room && room.Dormitory;
    return {
      first_name: student.first_name,
      middle_name: student.middle_name,
      last_name: student.last_name,
      date_of_birth: student.date_of_birth,
      dormitory_name: dormitory ? dormitory.name : 'Не визначено',
      room_number: room ? room.room_number : 'Не визначено',
    };
  }

  async getResidentsWithAccommodation() {
    const students = await this.fetchStudentsWithOccupancies();
    return students.map((student) => this.formatResidentData(student));
  }

  createStudentData(application) {
    return {
      first_name: application.first_name,
      middle_name: application.middle_name,
      last_name: application.last_name,
      date_of_birth: application.date_of_birth,
      home_address: application.home_address,
      phone_number: application.phone_number,
      email: application.email,
      home_city: application.home_city,
      home_region: application.home_region,
      home_campus_number: application.home_campus_number,
      home_street_number: application.home_street_number,
    };
  }

  async acceptApplication(application_id, dormitory_id, room_id) {
    const [application, room] = await Promise.all([
      this.applicationService.getApplicationById(application_id),
      this.dormitoryService.getRoomById(room_id),
    ]);

    if (!application || !room || room.dormitory_id !== parseInt(dormitory_id, 10)) {
      throw new Error('Невірна заявка або кімната');
    }

    const student = await this.studentService.createStudent(this.createStudentData(application));
    await this.assignRoom.execute(student.student_id, dormitory_id, room_id);
    await this.applicationService.deleteApplication(application_id);
  }

  async rejectApplication(application_id) {
    await this.applicationService.deleteApplication(application_id);
  }

  async authenticate(email, password) {
    const superintendent = await this.superintendentRepository.findByEmail(email);
    if (!superintendent || !(await bcrypt.compare(password, superintendent.password_hash))) {
      throw new Error('Невірний email або пароль');
    }
    return superintendent;
  }

  async searchStudents({ lastName, firstName, middleName, date_of_birth, dormitory_id, room_id }) {
    const where = {};
    if (lastName) where.last_name = { [Op.iLike]: `%${lastName}%` };
    if (firstName) where.first_name = { [Op.iLike]: `%${firstName}%` };
    if (middleName) where.middle_name = { [Op.iLike]: `%${middleName}%` };
    if (date_of_birth) where.date_of_birth = date_of_birth;

    const include = [{
      model: StudentOccupancy,
      as: 'Occupancies',
      attributes: [],
      required: false,
      include: [{
        model: Room,
        as: 'Room',
        attributes: ['room_number'],
        where: room_id ? { room_id } : null,
        include: [{
          model: Dormitory,
          as: 'Dormitory',
          attributes: ['name'],
          where: dormitory_id ? { dormitory_id } : null,
        }],
      }],
    }];

    const students = await this.studentService.getAllStudents({ where, include });
    return students.map((student) => this.formatResidentData(student));
  }
}

module.exports = SuperintendentService;