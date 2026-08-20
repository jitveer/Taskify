const User = require('../models/user.model');
const generatetoken = require('../utils/generateToken.util');
// const bcrypt = require('bcryptjs');

const authLoginService = async (email, password, role) => {
    // User Find
    const user = await User.findOne({ email });

    //user check
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    //password check (using bcrypt)
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //     const error = new Error("Invalid Details");
    //     error.statusCode = 403;
    //     throw error;
    // }

    //password check
    if (password != user.password) {
        const error = new Error("Invalid Details");
        error.statusCode = 403;
        throw error;
    }

    //role verify
    if (role != user.role) {
        const error = new Error("Invalid role");
        error.statusCode = 403;
        throw error;
    }


    //generate token
    const token = generatetoken(user._id, user.role, user.department)

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
        }
    };
};

module.exports = { authLoginService };
