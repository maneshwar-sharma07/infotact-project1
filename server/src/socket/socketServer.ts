import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '../config/redis';
import chatHandler from './handlers/chatHandler';
import typingHandler from './handlers/typingHandler';

export let io: SocketServer;

export async function initSocket(httpServer: HttpServer): Promise<SocketServer> {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Connect Redis clients and attach Socket.IO Redis adapter asynchronously
  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log('Socket.IO Redis adapter integrated successfully');
  } catch (error) {
    console.error('Failed to initialize Socket.IO Redis adapter:', error);
  }

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_key_min_32_chars';
      const decoded = jwt.verify(token, jwtSecret) as {
        id: string;
        role: string;
        email: string;
      };

      // Attach decoded user information to socket data
      socket.data.userId = decoded.id;
      socket.data.userEmail = decoded.email;
      socket.data.userRole = decoded.role;
      
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id} (User: ${socket.data.userId})`);

    // Register handlers
    chatHandler(io, socket);
    typingHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
}
