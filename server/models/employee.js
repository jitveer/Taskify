const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({

    employee_id: {
        type: String,
        required: true,
        unique: true
    },

    first_name: {
        type: String,
        required: true
    },

    last_name: String,

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: String,

    designation: String,

    department: String,

    role: {
        type: String,
        default: "employee"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Employee",
    employeeSchema
);