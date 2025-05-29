const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');

const Faculty = sequelize.define('Faculty', {
  faculty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'faculties',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Faculty;