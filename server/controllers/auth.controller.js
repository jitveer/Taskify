const { authLoginService } = require('../services/auth.service');

// SUPERADMIN, ADMIN, EMPLOYEE LOGIN
const authLogin = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const data = await authLoginService(email, password, role);

        return res.status(200).json({
            success: true,
            message: "login Successful",
            ...data
        });

    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json({
                success: false,
                message: e.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: e.message,
        });
    }
}

module.exports = { authLogin };