const Users = require('../models/user.model');

const addAdminValidation = async (req, res, next) => {
    try {
        const adminData = req.body || {};

        // 1. Name check
        if (!adminData.name || typeof adminData.name !== "string" || adminData.name.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Full Name is required and must be at least 3 characters long."
            });
        }

        // 2. Email check
        if (!adminData.email || typeof adminData.email !== "string" || !adminData.email.includes("@gmail.com")) {
            return res.status(400).json({
                success: false,
                message: "A valid Gmail address is required."
            });
        }

        // 3. Mobile check
        const mobileClean = (adminData.mobile || "").toString().trim();
        if (mobileClean.length !== 10) {
            return res.status(400).json({
                success: false,
                message: "Valid 10-digit mobile number is required."
            });
        }

        // 4. Password check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;
        if (!adminData.password || !passwordRegex.test(adminData.password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character."
            });
        }

        // 5. Department check
        if (!adminData.department) {
            return res.status(400).json({
                success: false,
                message: "Please select a department."
            });
        }

        // Normalize fields
        adminData.role = "admin";
        adminData.email = adminData.email.trim().toLowerCase();
        adminData.mobile = mobileClean;
        adminData.department = adminData.department.trim().toLowerCase();

        // 6. Duplicate check
        const userData = await Users.findOne({
            $or: [
                { email: adminData.email },
                { mobile: adminData.mobile }
            ]
        });

        if (userData) {
            return res.status(409).json({
                success: false,
                message: "An admin or employee with this Email or Mobile number already exists."
            });
        }

        next();
    } catch (err) {
        console.error("addAdminValidation error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error during validation"
        });
    }
};

module.exports = addAdminValidation;
