const userService = require('../services/user.service');

// ADD EMPLOYEE
const addEmployee = async (req, res) => {
    try {
        const newEmployee = await userService.addEmployee(req.body, req.user);
        return res.status(200).json({
            success: true,
            message: "Employee added successfuly",
            data: newEmployee
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Employee not added, ${error.message} `
        });
    }
}

// EMPLOYEE LIST
const employeeList = async (req, res) => {
    try {
        const employees = await userService.getEmployeeList(req.user);
        return res.status(200).json({
            success: true,
            employees
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Employee List Api Not Worked"
        });
    }
}

// DELETE EMPLOYEE
const employeeDelete = async (req, res) => {
    try {
        await userService.deleteEmployee(req.params.id, req.user);
        return res.status(200).json({
            success: true,
            message: "Employee Deleted"
        });
    } catch (e) {
        return res.status(e.statusCode || 200).json({
            success: false,
            message: e.message
        });
    }
}

// UPDATE EMPLOYEE DETAILS
const employeeUpdate = async (req, res) => {
    try {
        const updateEmp = await userService.updateEmployee(req.params.id, req.body, req.user);
        return res.status(200).json({
            success: true,
            message: "Employee Updated",
            user: updateEmp
        });
    } catch (e) {
        return res.status(e.statusCode || 400).json({
            success: false,
            message: e.message
        });
    }
}

const updateSelfProfile = async (req, res) => {
    try {
        const updatedUser = await userService.updateSelfProfile(req.user.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};

module.exports = { addEmployee, employeeList, employeeDelete, employeeUpdate, updateSelfProfile };