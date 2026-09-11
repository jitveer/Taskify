const jwt = require('jsonwebtoken');

const generateToken = (userId, role, department, name) => {
    return jwt.sign(
        {
            id: userId,
            name: name,
            role: role,
            department: department
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

module.exports = generateToken;