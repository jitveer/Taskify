const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const superAdminController = require('../controllers/superAdmin.controller');
const adminController = require('../controllers/admin.controller');
const employeeController = require('../controllers/employee.controller');
const taskController = require('../controllers/task.controller');
const Users = require('../models/user.model');
const addAdminValidation = require('../middlewares/addAdmin.validation');
const upload = require('../middlewares/upload.middleware');

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