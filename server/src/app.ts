import express from 'express';
import authRoutes from './routes/auth';
import workspaceRoutes from './routes/workspaces';
import channelRoutes from './routes/channels';
import messageRoutes from './routes/messages';

const app =express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

export default app;