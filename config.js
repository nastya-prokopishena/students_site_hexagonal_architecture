module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost', // Зміна з 'db' на 'localhost'
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '31220566',
    database: process.env.DB_NAME || 'dormitories',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  server: {
    port: process.env.PORT || 5500,
  },
};