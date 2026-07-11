import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorHandler';


// Import routes
import authRouter from './routes/auth';
import workspacesRouter from './routes/workspaces';
import channelsRouter from './routes/channels';
import messagesRouter from './routes/messages';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'), {
    dotfiles: 'deny',
    index: false,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'");
    },
  })
);

// Routes - Make sure these files exist!
app.use('/api/auth', authRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/channels', channelsRouter);
app.use('/api/messages', messagesRouter);

// Error Handler
app.use(errorHandler);

export default app;