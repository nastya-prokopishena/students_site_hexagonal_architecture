const sequelize = require('./sequelize');
const Application = require('../../domain/models/application');
const Benefit = require('../../domain/models/benefit');
const Dormitory = require('../../domain/models/dormitory');
const Faculty = require('../../domain/models/faculty');
const Price = require('../../domain/models/price');
const Room = require('../../domain/models/room');
const Specialty = require('../../domain/models/specialty');
const Student = require('../../domain/models/student');
const StudentOccupancy = require('../../domain/models/studentOccupancy');
const Superintendent = require('../../domain/models/superintendent');

if (!sequelize) {
  throw new Error('Sequelize instance is undefined in models/index.js');
}

// Define associations
Application.belongsTo(Benefit, { foreignKey: 'benefit_id', as: 'Benefit' });
Application.belongsTo(Faculty, { foreignKey: 'faculty_id', as: 'Faculty' });
Application.belongsTo(Specialty, { foreignKey: 'specialty_id', as: 'Specialty' });

StudentOccupancy.belongsTo(Student, { foreignKey: 'student_id', as: 'Student' });
StudentOccupancy.belongsTo(Dormitory, { foreignKey: 'dormitory_id', as: 'Dormitory' });
StudentOccupancy.belongsTo(Room, { foreignKey: 'room_id', as: 'Room' });
StudentOccupancy.belongsTo(Benefit, { foreignKey: 'benefit_id', as: 'Benefit' });

Student.hasMany(StudentOccupancy, { foreignKey: 'student_id', as: 'Occupancies' });
Room.hasMany(StudentOccupancy, { foreignKey: 'room_id', as: 'Occupancies' });
Dormitory.hasMany(StudentOccupancy, { foreignKey: 'dormitory_id', as: 'Occupancies' });

Room.belongsTo(Dormitory, { foreignKey: 'dormitory_id', as: 'Dormitory' });
Dormitory.hasMany(Room, { foreignKey: 'dormitory_id', as: 'Rooms' });

Dormitory.belongsTo(Price, { foreignKey: 'price_id', as: 'Price' });
Price.hasMany(Dormitory, { foreignKey: 'price_id', as: 'Dormitories' });

module.exports = {
  sequelize,
  Application,
  Benefit,
  Dormitory,
  Faculty,
  Price,
  Room,
  Specialty,
  Student,
  StudentOccupancy,
  Superintendent,
};