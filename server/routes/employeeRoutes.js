const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const taskController = require("../controllers/taskController");
const employeeController = require("../controllers/employeeController");

router.use(authMiddleware);
router.use(authorize('employee'));

router.get("/my-tasks", taskController.getMyTasks);
router.patch("/update-status/:id", taskController.updateTaskStatus);
router.patch("/update-profile", employeeController.updateSelfProfile);

module.exports = router;