const superAdminService = require('../services/superAdmin.service');
const userService = require('../services/user.service');

const adminLoginSuccess = async (req, res) => {
    try {
        const stats = await superAdminService.getDashboardStats();

        return res.status(200).json({
            success: true,
            ...stats,
            message: "authmiddleware working"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

// ALL USERS
const allUser = async (req, res) => {
    try {
        const allUsers = await userService.getAllUsersExceptSuperAdmin();

        return res.status(200).json({
            success: true,
            count: allUsers.length,
            users: allUsers
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { adminLoginSuccess, allUser };