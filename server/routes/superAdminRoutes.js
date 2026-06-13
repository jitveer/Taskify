const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const superAdminController = require('../controllers/superAdminController');
const Users = require('../models/Users');
const addAdminValidation = require('../middlewares/addAdminValidation');
const upload = require("../middlewares/uploadMiddleware");


// Apply authentication and authorization middleware to all routes
router.use(authMiddleware);
router.use(authorize('superadmin'));

// Dashboard Access
router.get("/dashboard", superAdminController.adminLoginSuccess);
router.get("/allUser", superAdminController.allUser);

router.post("/addadmin", addAdminValidation, superAdminController.addAdmin);
router.get('/adminLists', superAdminController.adminLists);
router.patch('/adminLists/:id', superAdminController.editAdmin);
router.delete('/adminLists/:id', superAdminController.deleteAdmin);

router.post('/addEmployee', superAdminController.addEmployee);
router.get('/employeeList', superAdminController.employeeList);
router.patch('/employeeLists/:id', superAdminController.employeeUpdate);
router.delete("/employeeLists/:id", superAdminController.employeeDelete);

// TASKS
router.post("/addTask", upload.array("attachments"), superAdminController.addTask);
router.get("/taskList", superAdminController.taskList);






module.exports = router;