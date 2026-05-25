const User = require("../models/Users");

// GET EMPLOYEES
const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ADD EMPLOYEE
const addEmployee = async (req, res) => {
    try {
        const newEmployee = await User.create({
            user_id: req.body.employee_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name || "",
            email: req.body.email,
            password: req.body.password,
            whatsapp_number: req.body.whatsapp_number || "",
            designation: req.body.designation || "",
            department: req.body.department || "",
            role: "employee"
        });

        res.status(201).json({
            success: true,
            message: "Employee Added Successfully",
            employee: newEmployee
        });
    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Employee email or ID already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE EMPLOYEE
const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await User.findOneAndUpdate(
            { _id: req.params.id, role: "employee" },
            {
                user_id: req.body.employee_id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password,
                whatsapp_number: req.body.whatsapp_number,
                designation: req.body.designation,
                department: req.body.department
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Employee Updated Successfully",
            employee: updatedEmployee
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.params.id, role: "employee" });
        res.status(200).json({
            success: true,
            message: "Employee Deleted Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
};