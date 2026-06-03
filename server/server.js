const express = require("express");
const connectDB = require('./config/db');
const cors = require("cors");
const dotenv = require("dotenv");

const superAdminRoutes = require("./routes/superAdminRoutes");
const authRouted = require('./routes/authRoutes');
const adminRoutes = require("./routes/adminRoutesssssssssss.js");
const employeeRoutes = require("./routes/employeeRoutes");
const router = require('./routes.js')


// Server Port
const PORT = process.env.PORT || 5000;
// Load environment variables
dotenv.config();
// Initialize express app
const app = express();


// MIDDLEWARE
app.use(cors());
app.use(express.json());




// Test Route
app.get("/", (req, res) => {
    res.send("Taskify Backend Running 🚀");
});

//MAIN ROUTES
app.use("/api", router);





connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});