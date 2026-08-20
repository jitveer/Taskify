const taskService = require('../services/task.service');
const taskAssignmentService = require('../services/taskAssignment.service');
const taskAssignmentRepository = require('../repositories/taskAssignment.repository');

// LIST TASKS (Admin / Creator view)
const taskList = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const taskLists = await taskService.getTaskLists(loggedInUserId);

        return res.status(200).json({
            success: true,
            message: "Successfully got Task List",
            assignedTasks: taskLists
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to get tasks",
            error: error.message
        });
    }
};

// ADD TASKS
const addTask = async (req, res) => {
    try {
        const taskData = req.body;
        let assigneeIds = [];

        // 1. Array Parsing: handle FormData format
        if (taskData.assignedTo) {
            if (typeof taskData.assignedTo === "string") {
                try {
                    assigneeIds = JSON.parse(taskData.assignedTo);
                } catch (error) {
                    assigneeIds = [taskData.assignedTo];
                }
            } else if (Array.isArray(taskData.assignedTo)) {
                assigneeIds = taskData.assignedTo;
            }
        }

        // Remove assignedTo from raw payload before model validation
        delete taskData.assignedTo;

        // 2. Attachments Handling
        if (req.files && req.files.length > 0) {
            taskData.attachments = req.files.map(file => ({
                fileName: file.originalname,
                fileUrl: `/uploads/${file.filename}`
            }));
        }

        // 3. Delegate creation to TaskService
        const { task, assignments } = await taskService.createTask(taskData, assigneeIds, req.user);

        // Compatibility payload for legacy frontend
        const taskObj = task.toObject();
        taskObj.assignedTo = assignments.map(a => a.assigneeId);

        return res.status(200).json({
            success: true,
            message: "Task Successfully Added",
            task: taskObj
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }
};

// GET MY TASKS (Employee view)
const getMyTasks = async (req, res) => {
    try {
        const tasks = await taskService.getMyTasks(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Successfully fetched your tasks",
            tasks
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to fetch tasks",
            error: error.message
        });
    }
};

// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;

        // 1. Locate specific TaskAssignment
        let assignment = await taskAssignmentRepository.findOne({ taskId: id, assigneeId: req.user.id });
        if (!assignment) {
            // Fallback search by assignment ID directly
            assignment = await taskAssignmentRepository.findById(id);
        }

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Task assignment not found for this user"
            });
        }

        // 2. Delegate update to TaskAssignmentService
        const updatedAssignment = await taskAssignmentService.updateStatus(assignment._id, status, req.user, comment);

        // Map back to a task-like object to satisfy client response schema
        const taskObj = updatedAssignment.taskId ? updatedAssignment.taskId.toObject() : {};
        taskObj.status = updatedAssignment.status;
        taskObj.completedAt = updatedAssignment.completedAt;

        return res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            task: taskObj
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to update task status",
            error: error.message
        });
    }
};

module.exports = {
    addTask,
    taskList,
    getMyTasks,
    updateTaskStatus
};