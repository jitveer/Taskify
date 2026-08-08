const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const router = express.Router();
const employeeController = require("../controllers/employeeController")
const taskController = require("../controllers/taskController");
const upload = require("../middlewares/uploadMiddleware");

router.use(authMiddleware);
router.use(authorize('admin'));

router.get('/employeeList', employeeController.employeeList);
router.post('/addEmployee', employeeController.addEmployee);
router.patch('/updateEmployee/:id', employeeController.employeeUpdate);
router.delete('/deleteEmployee/:id', employeeController.employeeDelete);
router.get('/allUser', employeeController.employeeList);

router.post('/addTask', upload.array("attachments"), taskController.addTask);
router.get('/taskList', taskController.taskList);

module.exports = router;