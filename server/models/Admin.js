const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

    admin_id: {
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

    department: String,

    role: {
        type: String,
        default: "admin"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Admin", adminSchema);