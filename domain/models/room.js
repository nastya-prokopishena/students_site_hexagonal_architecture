const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');


const Room = sequelize.define('Room', {
  room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dormitory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  floor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  block_id: {
    type: DataTypes.INTEGER,
  },
  room_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'rooms',
  timestamps: false
});

module.exports = Room;
