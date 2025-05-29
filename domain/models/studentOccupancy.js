const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');

const StudentOccupancy = sequelize.define('StudentOccupancy', {
    occupancy_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dormitory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lease_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lease_term: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lease_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    benefit_id: {
      type: DataTypes.INTEGER,
    },
}, {
    tableName: 'student_occupancy',
    timestamps: false});
  
    module.exports = StudentOccupancy;
  
  