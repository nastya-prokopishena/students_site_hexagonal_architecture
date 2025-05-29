const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');

const Application = sequelize.define(
  'Application',
  {
    application_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    home_address: DataTypes.STRING,
    home_city: DataTypes.STRING, 
    home_region: DataTypes.STRING,
    home_street_number: DataTypes.STRING,
    home_campus_number: DataTypes.STRING, 
    phone_number: DataTypes.STRING,
    email: DataTypes.STRING,
    faculty_id: DataTypes.INTEGER,
    specialty_id: DataTypes.INTEGER,
    benefit_id: DataTypes.INTEGER,
    year_of_study: DataTypes.INTEGER,
  },
  {
    tableName: 'applications',
    timestamps: true, 
  });


module.exports = Application;
