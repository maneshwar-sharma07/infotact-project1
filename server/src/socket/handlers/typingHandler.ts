import { Server, Socket } from 'socket.io';

export default function typingHandler(_io: Server, socket: Socket) {
  // Handle start typing indicator
  socket.on('typing:start', (data: { channelId: string; userName: string }) => {
    const { channelId, userName } = data;
    if (channelId && userName) {
      // Broadcast to room excluding the sender
      socket.to(channelId).emit('typing:start', { userName });
    }
  });

  // Handle stop typing indicator
  socket.on('typing:stop', (data: { channelId: string }) => {
    const { channelId } = data;
    if (channelId) {
      // Broadcast to room excluding the sender
      socket.to(channelId).emit('typing:stop');
    }
  });
}
