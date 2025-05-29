const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');

const Dormitory = sequelize.define('Dormitory', {
  dormitory_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  floor_amount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type_residents: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  price_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'dormitories',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Dormitory;