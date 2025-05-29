const { Sequelize } = require('sequelize');
const config = require('../../config');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  logging: console.log, // Enable query logging for debugging
});

module.exports = sequelize;