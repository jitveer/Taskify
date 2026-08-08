const express = require("express");
const Users = require("../models/Users");
const router = express.Router();




const adminLoginSuccess = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "authmiddleware working"
    })
}



// ALL USERS

const allUser = async (req, res) => {

    try {
        const allUsers = await Users.find({ role: { $ne: "superadmin" } }).select("-password");

        if (!allUsers) {
            return res.status(400).json({
                success: false,
                message: "Did not get All Users"
            })
        }

        return res.status(200).json({
            success: true,
            count: allUsers.length,
            users: allUsers
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}





module.exports = { adminLoginSuccess, allUser };