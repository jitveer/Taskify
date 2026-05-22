const express = require("express");

const router = express.Router();

const Admin = require("../models/Admin");



// GET ADMINS
router.get("/", async (req, res) => {

    try {

        const admins = await Admin.find();

        res.json(admins);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching admins"
        });
    }
});



// ADD ADMIN
router.post("/add", async (req, res) => {

    try {

        const newAdmin = new Admin({

            admin_id: req.body.admin_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            department: req.body.department

        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: "Admin Added Successfully",
            admin: newAdmin
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error adding admin"
        });
    }
});



module.exports = router;