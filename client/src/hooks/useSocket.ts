import { useEffect } from 'react';
import { socket } from '../services/socket.ts';

export const useSocket = (channelId: string | null | undefined) => {
  useEffect(() => {
    if (!channelId) return;

    // Update dynamic authentication token on connection
    const token = localStorage.getItem('token');
    socket.auth = (cb: (data: { token: string }) => void) => {
      cb({ token: token || '' });
    };

    // Connect socket
    socket.connect();

    // Join room for this channel
    socket.emit('chat:join', { channelId });

    // Cleanup on channel change or component unmount
    return () => {
      socket.emit('chat:leave', { channelId });
      socket.disconnect();
    };
  }, [channelId]);

  return socket;
};

export default useSocket;
