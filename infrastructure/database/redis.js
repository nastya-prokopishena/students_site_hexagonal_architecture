const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('reconnecting', () => console.log('Redis Client Reconnecting'));
redisClient.on('end', () => console.log('Redis Client Disconnected'));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

module.exports = {
  async get(key) {
    await connectRedis();
    return redisClient.get(key);
  },
  async setEx(key, seconds, value) {  // Змінено з setex на setEx
    await connectRedis();
    return redisClient.setEx(key, seconds, value);
  },
  async del(key) {
    await connectRedis();
    return redisClient.del(key);
  },
  redisClient,
};