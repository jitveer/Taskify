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

// Server Port
const PORT = process.env.PORT || 5000;
// Load environment variables
dotenv.config();
// Initialize express app
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
// Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get("/", (req, res) => {
    res.send("Taskify Backend Running 🚀");
});

// MAIN ROUTES
app.use("/api", router);

connectDB();

// 3. wrap the express app in http server
const server = http.createServer(app);

// 4. Initialize Socket Server
initSocket(server);

// 5. Start server using server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
