const Employee = require("../models/employee");


// GET EMPLOYEES
const getEmployees = async (req, res) => {

    try {

        const employees = await Employee.find();

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

        const newEmployee = await Employee.create({

            employee_id: req.body.employee_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            designation: req.body.designation,
            department: req.body.department

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
                message: "Employee email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getEmployees,
    addEmployee
};