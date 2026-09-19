// const express = require('express');
// const connectDB = require('./config/db.config');
// const cors = require('cors');
// const dotenv = require('dotenv');

// const superAdminRoutes = require('./routes/superAdmin.routes');
// const authRouted = require('./routes/auth.routes');
// const employeeRoutes = require('./routes/employee.routes');
// const router = require('./routes.js')
// const path = require('path');


// // Server Port
// const PORT = process.env.PORT || 5000;
// // Load environment variables
// dotenv.config();
// // Initialize express app
// const app = express();


// // MIDDLEWARE
// app.use(cors());
// app.use(express.json());
// // Serve uploads folder as static
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// // Test Route
// app.get("/", (req, res) => {
//     res.send("Taskify Backend Running 🚀");
// });


// //MAIN ROUTES
// app.use("/api", router);


// connectDB();

// // Start Server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });











const express = require('express');
const connectDB = require('./config/db.config');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // 1. HTTP module import kiya
const { initSocket } = require('./utils/socketHelper'); // 2. Socket Helper import kiya

const superAdminRoutes = require('./routes/superAdmin.routes');
const authRouted = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const router = require('./routes.js')
const path = require('path');

const helmet = require('helmet');

// Server Port
const PORT = process.env.PORT || 5000;
// Load environment variables
dotenv.config();
// Initialize express app
const app = express();

// Security: Disable express fingerprint header
app.disable('x-powered-by');

// Security: Helmet for HTTP header protection (Clickjacking, XSS, MIME sniffing)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const secureUploadsHandler = require('./middlewares/fileAuth.middleware');
const { apiLimiter } = require('./middlewares/rateLimiter.middleware');

// Strict CORS Configuration
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("CORS Policy: Access denied from this origin"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Protected uploads access (requires JWT authentication strictly via Authorization Header)
app.get("/uploads/:filename", secureUploadsHandler);

// Test Route
app.get("/", (req, res) => {
    res.send("Taskify Backend Running 🚀");
});

// MAIN ROUTES (with DoS / Spam Protection Rate Limiter)
app.use("/api", apiLimiter, router);

connectDB();

// 3. wrap the express app in http server
const server = http.createServer(app);

// 4. Initialize Socket Server
initSocket(server);

// 5. Initialize Task Deadline & Overdue Reminder Scheduler
const { initTaskDeadlineScheduler } = require('./services/scheduler.service');
initTaskDeadlineScheduler();

// 6. Start server using server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
