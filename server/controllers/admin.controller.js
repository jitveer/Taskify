const userService = require('../services/user.service');

// ADMIN LIST
const adminLists = async (req, res) => {
    try {
        const admins = await userService.getAdminLists();
        return res.status(200).json({
            success: true,
            admins
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// ADD ADMIN
const addAdmin = async (req, res) => {
    try {
        const newUser = await userService.addAdmin(req.body);
        return res.status(200).json({
            success: true,
            message: "New User Added",
            data: newUser
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

// EDIT ADMIN
const editAdmin = async (req, res) => {
    try {
        await userService.editAdmin(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Admin Updated"
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message
        });
    }
}

// DELETE ADMIN
const deleteAdmin = async (req, res) => {
    try {
        await userService.deleteAdmin(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Admin Deleted"
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { adminLists, addAdmin, editAdmin, deleteAdmin };
