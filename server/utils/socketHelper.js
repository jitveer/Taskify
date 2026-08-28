const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Yahan production me specific frontend URL specify kar sakte hain
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Jab user connect hoga toh wo apni userId se unique room me enter karega
        socket.on('join_room', (userId) => {
            if (userId) {
                socket.join(userId);
                console.log(`User with ID: ${userId} joined room`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Pure project me kahin se bhi sockets emit karne ke liye function
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized yet!");
    }
    return io;
};

module.exports = {
    initSocket,
    getIO
};
