const express = require("express");
const Users = require("../models/Users");
const taskTabel = require("../models/Tasks");
const router = express.Router();


// ADD EMPLOYEE

const addEmployee = async (req, res) => {
    try {

        const iAmUser = req.user.role;

        //FOR SUPERADMIN
        if (iAmUser == "superadmin") {

            const employeeData = req.body;
            let nextUserId;

            if (employeeData.role === "employee") {
                const lastUser = await Users.findOne({ role: "employee", user_id: { $gte: 2000 } }).sort({ user_id: -1 });
                nextUserId = lastUser ? Number(lastUser.user_id) + 1 : 2000;
            }

            employeeData.user_id = nextUserId;

            const newEmployee = await Users.create(employeeData);

            return res.status(200).json({
                success: true,
                message: "Employee added successfuly",
                data: newEmployee
            })

        }


        //FOR ADMIN
        if (iAmUser == "admin") {
            const employeeData = req.body;
            employeeData.department = req.user.department;
            let nextUserId;

            if (employeeData.role === "employee") {
                const lastUser = await Users.findOne({ role: "employee", user_id: { $gte: 2000 } }).sort({ user_id: -1 });
                nextUserId = lastUser ? Number(lastUser.user_id) + 1 : 2000;
            }

            employeeData.user_id = nextUserId;

            const newEmployee = await Users.create(employeeData);

            return res.status(200).json({
                success: true,
                message: "Employee added successfuly",
                data: newEmployee
            })

        }





    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Employee not added, ${error.message} `
        })
    }
}



// EMPLOYEE LIST

const employeeList = async (req, res) => {

    try {

        const iAmUser = req.user.role;

        //FOR SUPERADMIN
        if (iAmUser == "superadmin") {
            const employeeList = await Users.find({ role: "employee" }).select("-password");

            if (!employeeList) {
                return res.status(400).json({
                    success: false,
                    message: "Emloyee list is not visible"
                })
            }

            return res.status(200).json({
                success: true,
                employees: employeeList
            })
        }

        // //FOR ADMIN
        if (iAmUser == "admin") {
            const employeeList = await Users.find({ role: "employee", department: req.user.department }).select("-password");

            if (!employeeList) {
                return res.status(400).json({
                    success: false,
                    message: "Emloyee list is not visible"
                })
            }

            return res.status(200).json({
                success: true,
                employees: employeeList
            })
        }






    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Employee List Api Not Worked"
        })
    }
}



// DELETE EMPLOYEE

const employeeDelete = async (req, res) => {

    try {
        const employeeId = req.params.id;
        const iAmUser = req.user.role;

        const query = { _id: employeeId };
        if (iAmUser === "admin") {
            query.department = req.user.department;
        }

        const deleteEmployee = await Users.findOneAndDelete(query);

        if (!deleteEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found or unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee Deleted"
        });



    } catch (e) {
        return res.status(200).json({
            success: false,
            message: e.message
        })
    }

}




// UPDATE EMPLOYEE DETAILS

const employeeUpdate = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employeeUpdate = req.body;
        const iAmUser = req.user.role;

        const query = { _id: employeeId };
        if (iAmUser === "admin") {
            query.department = req.user.department;
        }

        const updateEmp = await Users.findOneAndUpdate(query, employeeUpdate, { new: true });

        if (!updateEmp) {
            return res.status(400).json({
                success: false,
                message: "User not found or unauthorized"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Employee Updated",
            user: updateEmp
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}





module.exports = { addEmployee, employeeList, employeeDelete, employeeUpdate };