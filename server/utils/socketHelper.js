const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // In production, replace with specific frontend origin
            methods: ["GET", "POST"]
        }
    });

    // 1. Socket Authentication Middleware (Verify JWT token before allowing connection)
    io.use((socket, next) => {
        try {
            const rawToken = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
            if (!rawToken) {
                return next(new Error("Authentication error: Token required"));
            }

            const token = rawToken.startsWith("Bearer ") ? rawToken.split(" ")[1] : rawToken;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Attach verified user payload { id, name, role, department }
            next();
        } catch (error) {
            return next(new Error("Authentication error: Invalid or expired token"));
        }
    });

    // 2. Connection Handler
    io.on('connection', (socket) => {
        const userId = socket.user?.id;
        if (userId) {
            // Auto-join the verified user to their own private room
            socket.join(userId.toString());
            console.log(`Authenticated user connected: ${socket.user?.name} (${userId})`);
        }

        // Secure join_room handler (strictly enforce that users can only join their own room)
        socket.on('join_room', (requestedUserId) => {
            if (userId && requestedUserId && requestedUserId.toString() === userId.toString()) {
                socket.join(userId.toString());
            } else {
                console.warn(`Blocked unauthorized room join attempt from user ${userId} to room ${requestedUserId}`);
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
