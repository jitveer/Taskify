const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    user_id: {
        type: String,
        required: true,
        unique: true
    },

    // first_name: {
    //     type: String,
    //     required: true
    // },

    // last_name: {
    //     type: String
    // },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    mobile: {
        type: String
    },

    password: {
        type: String,
        required: true
    },

    department: {
        type: String,
        enum: ["csr", "it", "hr", "interior", "sales", "accounts"],
        required: true
    },

    role: {
        type: String,
        enum: ["superadmin", "admin", "employee"],
        required: true
    },

}, {
    timestamps: true
});


// PASSWORD HASHING HOOK: Save hone se pehle password encrypt hoga
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         return next();
//     }
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });




module.exports = mongoose.model("User", userSchema);