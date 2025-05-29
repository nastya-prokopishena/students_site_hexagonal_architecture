const app = require('./interfaces/web/server');
const { sequelize } = require('./infrastructure/database/models');

const port = 5500;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    if (!sequelize) {
      throw new Error('Sequelize instance is undefined');
    }
    await sequelize.authenticate();
    console.log('Connection to DB successful');
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
});