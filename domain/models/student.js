const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middle_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  home_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  home_city: {
    type: DataTypes.STRING,
  },
  home_region: {
    type: DataTypes.STRING,
  },
  home_campus_number: {
    type: DataTypes.STRING,
  },
  home_street_number: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'students',
  timestamps: false
});

module.exports = Student;
