const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');


const FacultyAffiliation = sequelize.define('FacultyAffiliation', {
  affiliation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: DataTypes.INTEGER,
  faculty_id: DataTypes.INTEGER,
  study_year: DataTypes.INTEGER,
  specialty_id: DataTypes.INTEGER,
}, {
  tableName: 'faculty_affiliation',
  timestamps: false,
});


module.exports = FacultyAffiliation;
