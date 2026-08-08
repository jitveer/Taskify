const express = require("express");
const Users = require("../models/Users");
const taskTabel = require("../models/Tasks");
const router = express.Router();


// ADMIN LIST
const adminLists = async (req, res) => {
    try {
        const allAdmins = await Users.find({ role: 'admin' }).select("-password");
        if (allAdmins) {
            return res.status(200).json({
                success: true,
                admins: allAdmins
            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}


// ADD ADIMIN
const addAdmin = async (req, res) => {

    let nextUserId;

    try {
        const adminData = req.body;
        const user_id = "";

        // ASSIGNING USERID BY BACEND

        let nextUserId;

        if (adminData.role === "admin") {
            const lastUser = await Users.findOne({ role: "admin", user_id: { $gte: 1000, $lt: 2000 } }).sort({ user_id: -1 });
            nextUserId = lastUser ? Number(lastUser.user_id) + 1 : 1000;
        }

        adminData.user_id = nextUserId;

        // SAVE NEW USER
        const newUser = await Users.create(adminData);
        return res.status(200).json({
            success: true,
            message: "New User Added",
            data: newUser
        })

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

        const adminId = req.params.id;
        const adminNewData = req.body;

        const updateAdmin = await Users.findByIdAndUpdate(adminId, adminNewData, { new: true });


        if (!updateAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin Updated"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


// DELETE ADMIN
const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        const adminDelete = await Users.findByIdAndDelete(adminId);

        if (!adminDelete) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin Deleted"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};





module.exports = { adminLists, addAdmin, editAdmin, deleteAdmin };
