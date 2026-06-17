import express from 'express';
import authRoutes from './routes/auth';
import workspaceRoutes from './routes/workspace.routes';
import channelRoutes from './routes/channel.routes';


const app =express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/channels', channelRoutes);
export default app;