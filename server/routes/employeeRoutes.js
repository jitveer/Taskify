const express = require("express");

const router = express.Router();

const {
    getEmployees,
    addEmployee
} = require("../controllers/employeeController");


// GET EMPLOYEES
router.get("/", getEmployees);


// ADD EMPLOYEE
router.post("/add", addEmployee);


module.exports = router;