const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');

const Benefit = sequelize.define('Benefit', {
  benefit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'benefits',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Benefit;