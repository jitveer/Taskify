import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = (userId) => {
    if (socket && socket.connected) return socket;

    // Vite env file se backend server URL read kiya (default to port 5000)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const token = localStorage.getItem("token");

    socket = io(backendUrl, {
        auth: {
            token: token
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    console.log('Connecting authenticated socket...');

    socket.on('connect', () => {
        console.log('Connected to socket server successfully');
        if (userId) {
            socket.emit('join_room', userId);
        }
    });

    socket.on('connect_error', (err) => {
        console.warn('Socket connection authentication warning:', err.message);
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
