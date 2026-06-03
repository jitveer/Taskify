const express = require("express");
const Users = require("../models/Users");
const router = express.Router();


const addAdminValidation = async (req, res, next) => {

    const adminData = req.body;


    // VALIDATION
    if (adminData.name.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Name is too short"
        })
    }

    if (!(adminData.email.includes("@gmail.com"))) {
        return res.status(400).json({
            success: false,
            message: "This mail is not Valid"
        })
    }

    if (adminData.mobile.length !== 10) {
        return res.status(400).json({
            success: false,
            message: "Wrong Mobile Number"
        })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;
    if (!passwordRegex.test(adminData.password)) {
        return res.status(400).json({
            success: false,
            message:
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
    }


    const userData = await Users.findOne({
        $or: [
            { email: adminData.email },
            { mobile: adminData.mobile }
        ]
    });

    if (userData) {
        return res.status(409).json({
            success: false,
            message: "User already exist"
        });
    }

    next();

}


module.exports = addAdminValidation;
