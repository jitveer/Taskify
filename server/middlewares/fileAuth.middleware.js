const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const secureUploadsHandler = (req, res) => {
    try {
        // 1. Authenticate Token strictly from Authorization Header
        let token = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Access token required to view attachments."
            });
        }

        // 2. Verify JWT Token
        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtErr) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid or expired token."
            });
        }

        // 3. Prevent Path Traversal Attack (e.g. ../../.env)
        const filename = path.basename(req.params.filename);
        const uploadsDir = path.resolve(__dirname, '..', 'uploads');
        const filePath = path.join(uploadsDir, filename);

        // Ensure the resolved file path is strictly inside the uploads directory
        if (!filePath.startsWith(uploadsDir)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Invalid file path."
            });
        }

        // 4. Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found."
            });
        }

        // 5. Security Headers
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Cache-Control", "private, max-age=3600");

        return res.sendFile(filePath);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error reading file."
        });
    }
};

module.exports = secureUploadsHandler;
