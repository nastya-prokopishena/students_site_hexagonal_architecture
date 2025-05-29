const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');

const Specialty = sequelize.define('Specialty', {
  specialty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'specialties',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Specialty;