const express = require("express");
const router = express.Router();
const {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

// GET EMPLOYEES
router.get("/", getEmployees);

// ADD EMPLOYEE
router.post("/add", addEmployee);

// UPDATE EMPLOYEE
router.put("/:id", updateEmployee);

// DELETE EMPLOYEE
router.delete("/:id", deleteEmployee);

module.exports = router;