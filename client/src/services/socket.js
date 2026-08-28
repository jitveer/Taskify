import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = (userId) => {
    if (socket) return socket;

    // Vite env file se backend server URL read kiya (default to port 5000)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    socket = io(backendUrl);

    console.log('Connecting socket...');

    socket.on('connect', () => {
        console.log('Connected to socket server successfully');
        // Connection success hone par backend me apni userId wale room me enter karein
        if (userId) {
            socket.emit('join_room', userId);
        }
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting socket...');
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;
