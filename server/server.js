const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

// Load environment variables
dotenv.config();


// Initialize express app
const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// login
app.use("/api/users", userRoutes);

app.use("/api/admins", adminRoutes);
app.use("/api/employees", employeeRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Taskify Backend Running 🚀");
});



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });



// Server Port
const PORT = process.env.PORT || 5000;



// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});