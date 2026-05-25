const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    user_id: {
        type: String,
        required: true,
        unique: true
    },

    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    department: {
        type: String
    },

    role: {
        type: String,
        enum: ["superadmin", "admin", "employee"],
        required: true
    },

    whatsapp_number: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);