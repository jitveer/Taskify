const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Authorization Header Check
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token not provided"
            });
        }

        // Get token from Bearer Token
        const token = authHeader.split(" ")[1];

        // Token Verify
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // User Data Request me Save
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

module.exports = authMiddleware;