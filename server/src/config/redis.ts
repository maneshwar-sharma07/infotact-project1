import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Setup publisher client
export const pubClient = createClient({ url: redisUrl });

pubClient.on('error', (err) => console.error('Redis Pub Client Error', err));
pubClient.on('connect', () => console.log('Redis Pub Client Connected'));

// Setup subscriber client
export const subClient = pubClient.duplicate();

subClient.on('error', (err) => console.error('Redis Sub Client Error', err));
subClient.on('connect', () => console.log('Redis Sub Client Connected'));
