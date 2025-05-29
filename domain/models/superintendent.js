const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/sequelize');


const Superintendent = sequelize.define('superintendent', {
  superintendent_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  middle_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'superintendents',
  timestamps: false
});

module.exports = Superintendent;
