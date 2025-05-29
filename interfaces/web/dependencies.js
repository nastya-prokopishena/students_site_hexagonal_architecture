const models = require('../../infrastructure/database/models');

if (!models.sequelize) {
  throw new Error('Sequelize instance is undefined in models');
}

module.exports = {
  sequelize: models.sequelize,
  Benefit: models.Benefit,
  Dormitory: models.Dormitory,
  Price: models.Price,
  Faculty: models.Faculty,
  Specialty: models.Specialty,
  Superintendent: models.Superintendent,
  Student: models.Student,
  Application: models.Application,
};