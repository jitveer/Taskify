const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const taskController = require('../controllers/task.controller');
const employeeController = require('../controllers/employee.controller');
const upload = require('../middlewares/upload.middleware');


router.use(authMiddleware);
// router.use(authorize('employee'));

router.get("/my-tasks", authorize('employee', 'admin', 'superadmin'), taskController.getMyTasks);
router.patch("/update-status/:id", authorize('employee', 'admin', 'superadmin'), upload.single("attachment"), taskController.updateTaskStatus);
// Profile editing blocked for employee (Postman/API access disabled)
// router.patch("/update-profile", authorize('employee'), employeeController.updateSelfProfile);

module.exports = router;