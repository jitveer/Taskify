const express = require("express");
const router = express.Router();
const User = require("../models/Users");

// GET ADMINS
router.get("/", async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" });
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
        const newAdmin = new User({
            user_id: req.body.admin_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name || "",
            email: req.body.email,
            password: req.body.password,
            whatsapp_number: req.body.whatsapp_number || "",
            department: req.body.department || "",
            role: "admin"
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
            message: error.message || "Error adding admin"
        });
    }
});

// DELETE ADMIN
router.delete("/:id", async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.params.id, role: "admin" });
        res.json({
            success: true,
            message: "Admin deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error deleting admin"
        });
    }
});

// UPDATE ADMIN
router.put("/:id", async (req, res) => {
    try {
        const updatedAdmin = await User.findOneAndUpdate(
            { _id: req.params.id, role: "admin" },
            {
                user_id: req.body.admin_id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password,
                whatsapp_number: req.body.whatsapp_number,
                department: req.body.department
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Admin updated successfully",
            admin: updatedAdmin
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error updating admin"
        });
    }
});

module.exports = router;