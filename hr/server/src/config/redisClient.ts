import { createClient } from 'redis';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Get Redis connection settings from environment variables
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD || '';

// Create the Redis client using the environment variables
const client = createClient({
  url: `redis://${redisHost}:${redisPort}`, // Using the Redis URL format
});

// Event listener for Redis connection
client.on('connect', () => {
  console.log('Connected to Redis server.');

  // Authenticate after the connection is established if a password is provided
  if (redisPassword) {
    // Correctly pass the password as part of an object
    client.auth({ password: redisPassword }).catch((err) => {
      console.error('Redis Auth Error:', err);
    });
  }
});

// Event listener for Redis errors
client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Attempt to connect to the Redis server
const connectToRedis = async () => {
  try {
    await client.connect();
    console.log('Successfully connected to Redis.');
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
};

// Call the connect function
connectToRedis();

// Set interval to clear all Redis data every 1 hour (3600000 ms)
setInterval(async () => {
  try {
    // Use FLUSHALL to clear all data in all databases, or FLUSHDB to clear just the current database
    await client.flushAll();
    console.log('All Redis data cleared successfully!');
  } catch (err) {
    console.error('Error clearing Redis data:', err);
  }
}, 3600000); // 3600000ms = 1 hour

// Export the Redis client for use in other files
export default client;
