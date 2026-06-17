import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import chatHandler from './handlers/chatHandler';
import typingHandler from './handlers/typingHandler';

export let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Redis adapter imports and configuration (to be uncommented and integrated on Monday 23rd June)
  /*
  // import { createAdapter } from "@socket.io/redis-adapter"
  // import { pubClient, subClient } from "../config/redis"
  // await Promise.all([pubClient.connect(), subClient.connect()])
  // io.adapter(createAdapter(pubClient, subClient))
  */

  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Register handlers
    chatHandler(io, socket);
    typingHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
}
