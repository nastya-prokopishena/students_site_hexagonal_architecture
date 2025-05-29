const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');

const Price = sequelize.define('Price', {
  price_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  price_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  tableName: 'price',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Price;