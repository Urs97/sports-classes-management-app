import { io, Socket } from 'socket.io-client';

export const connectAdminSocket = (token: string): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    const socket = io('ws://localhost:3001', {
      path: '/socket.io',
      transports: ['websocket'],
      auth: { token },
    });

    socket.on('connect', () => resolve(socket));

    socket.on('connect_error', (err) => reject(err));

    socket.on('disconnect', () => {
      // Handle disconnection
    });
  });
};
