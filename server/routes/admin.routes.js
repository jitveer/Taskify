const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const router = express.Router();
const employeeController = require('../controllers/employee.controller')
const taskController = require('../controllers/task.controller');
const upload = require('../middlewares/upload.middleware');

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