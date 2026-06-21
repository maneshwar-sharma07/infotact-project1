import { Server, Socket } from 'socket.io';
import Message from '../../models/Message';
import User from '../../models/User';

export default function chatHandler(io: Server, socket: Socket) {
  // Handle join channel room
  socket.on('chat:join', (data: any) => {
    const channelId = typeof data === 'object' ? data.channelId : data;
    if (channelId) {
      socket.join(channelId);
      console.log(`Socket ${socket.id} joined channel: ${channelId}`);
    }
  });

  // Handle leave channel room
  socket.on('chat:leave', (data: any) => {
    const channelId = typeof data === 'object' ? data.channelId : data;
    if (channelId) {
      socket.leave(channelId);
      console.log(`Socket ${socket.id} left channel: ${channelId}`);
    }
  });

  // Handle new incoming chat message
  socket.on('chat:message', async (data: { channelId: string; content: string; senderId: string }) => {
    try {
      const { channelId, content, senderId } = data;
      if (!channelId || !content || !senderId) {
        console.warn('Invalid chat:message payload:', data);
        return;
      }

      // Query sender user to get name
      const user = await User.findById(senderId);
      const senderName = user ? user.name : 'User';

      // Save message to MongoDB using Message model
      const message = await Message.create({
        content,
        sender: senderId,
        channel: channelId,
      });

      // Broadcast to the channel room (including sender)
      io.to(channelId).emit('chat:message', {
        id: message._id.toString(),
        channelId,
        content,
        senderId,
        senderName,
        timestamp: message.createdAt.toISOString(),
      });
    } catch (error) {
      console.error('Error in chat:message handler:', error);
    }
  });
}
