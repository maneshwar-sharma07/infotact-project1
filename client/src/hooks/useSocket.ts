import { useEffect } from 'react';
import { socket } from '../services/socket.ts';

export const useSocket = (
  channelId: string | null | undefined,
  workspaceId?: string | null
) => {
  useEffect(() => {
    if (!channelId) return;

    // Update dynamic authentication token on connection
    const token = localStorage.getItem('token');
    socket.auth = (cb: (data: { token: string }) => void) => {
      cb({ token: token || '' });
    };

    const joinChannel = () => {
      socket.emit('chat:join', { channelId });
      if (workspaceId) {
        socket.emit('workspace:join', { workspaceId });
      }
    };

    socket.connect();

    if (socket.connected) {
      joinChannel();
    } else {
      socket.once('connect', joinChannel);
    }

    // Cleanup on channel change or component unmount
    return () => {
      socket.emit('chat:leave', { channelId });
      if (workspaceId) {
        socket.emit('workspace:leave', { workspaceId });
      }
      socket.off('connect', joinChannel);
      socket.disconnect();
    };
  }, [channelId, workspaceId]);

  return socket;
};

export default useSocket;
