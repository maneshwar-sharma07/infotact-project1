import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { initSocket, io } from './socket/socketServer';

// Import route handlers
import authRouter from './routes/auth';
import workspacesRouter from './routes/workspaces';
import channelsRouter from './routes/channels';
import messagesRouter from './routes/messages';

// Initialize environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO server
initSocket(httpServer);

// Establish connection to MongoDB
connectDB();

// Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Mount API Routers
app.use('/api/auth', authRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/channels', channelsRouter);
app.use('/api/messages', messagesRouter);

// Global Error Handler Middleware (must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export { io };
