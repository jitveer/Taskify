const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const superAdminController = require('../controllers/superAdminController');
const adminController = require('../controllers/adminController');
const employeeController = require('../controllers/employeeController');
const taskController = require('../controllers/taskController');
const Users = require('../models/Users');
const addAdminValidation = require('../middlewares/addAdminValidation');
const upload = require("../middlewares/uploadMiddleware");

// Apply authentication and authorization middleware to all routes
router.use(authMiddleware);
router.use(authorize('superadmin'));

// Dashboard Access
router.get("/dashboard", superAdminController.adminLoginSuccess);
router.get("/allUser", superAdminController.allUser);

router.get('/adminLists', adminController.adminLists);
router.post("/addadmin", addAdminValidation, adminController.addAdmin);
router.patch('/adminLists/:id', adminController.editAdmin);
router.delete('/adminLists/:id', adminController.deleteAdmin);

router.post('/addEmployee', employeeController.addEmployee);
router.get('/employeeList', employeeController.employeeList);
router.patch('/employeeLists/:id', employeeController.employeeUpdate);
router.delete("/employeeLists/:id", employeeController.employeeDelete);

// // TASKS
router.post("/addTask", upload.array("attachments"), taskController.addTask);
router.get("/taskList", taskController.taskList);






module.exports = router;