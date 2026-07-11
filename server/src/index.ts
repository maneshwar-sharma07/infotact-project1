import app from './app';
import { createServer } from 'http';
import { initSocket } from './socket/socketServer';

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

// Initialize Socket.IO
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});