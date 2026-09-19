const User = require('../models/user.model');
const generatetoken = require('../utils/generateToken.util');
const bcrypt = require('bcryptjs');

const authLoginService = async (email, password, role) => {
    // Sanity validation on input lengths to prevent memory attacks
    if (!email || typeof email !== 'string' || email.length > 100 || !password || typeof password !== 'string' || password.length > 100) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // 1. Find user by normalized email
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // 2. Verify Role
    if (role !== user.role) {
        const error = new Error("Invalid role selection");
        error.statusCode = 403;
        throw error;
    }

    // 3. Verify Password (using bcrypt with legacy fallback)
    const isBcryptHash = typeof user.password === "string" && user.password.startsWith("$2");
    let isMatch = false;

    if (isBcryptHash) {
        isMatch = await bcrypt.compare(password, user.password);
    } else {
        // Plain-text check for any legacy accounts
        isMatch = (password === user.password);
        if (isMatch) {
            // Auto-upgrade legacy plaintext password to secure bcrypt hash
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
        }
    }

    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // 4. Generate JWT Token
    const token = generatetoken(user._id, user.role, user.department, user.name);

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
