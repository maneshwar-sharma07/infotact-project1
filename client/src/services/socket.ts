import { io, Socket } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Initialize socket instance with autoConnect set to false
export const socket: Socket = io(socketUrl, {
  autoConnect: false,
  auth: (cb) => {
    cb({
      token: localStorage.getItem('token') || '',
    });
  },
});

export default socket;
