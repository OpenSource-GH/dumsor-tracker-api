const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          return Math.min(1000 * Math.pow(2, retries), 10000);
        },
      },
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });

    this.client.on('reconnecting', () => {
      console.log('Redis Client Reconnecting...');
    });

    this.client.on('ready', () => {
      console.log('Redis Client Ready');
    });

    this.connect().catch(console.error);
  }

  async connect() {
    try {
      await this.client.connect();
    } catch (err) {
      console.error('Redis Connection Error:', err);
      throw err;
    }
  }

  getClient() {
    if (!this.client.isOpen) {
      throw new Error('Redis client is not connected');
    }
    return this.client;
  }

  async quit() {
    try {
      await this.client.quit();
      console.log('Redis connection closed');
    } catch (err) {
      console.error('Error closing Redis connection:', err);
      throw err;
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
