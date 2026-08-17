const mongoose = require('mongoose');
const taskService = require("../services/taskService");
const taskAssignmentService = require("../services/taskAssignmentService");
const taskRepository = require("../repositories/taskRepository");
const taskAssignmentRepository = require("../repositories/taskAssignmentRepository");

// LIST TASKS (Admin / Creator view)
const taskList = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const tasks = await taskRepository.find({ assignedBy: loggedInUserId });
        const taskIds = tasks.map(t => t._id);

        // Fetch all assignments associated with these tasks in a single query (resolving N+1 query issue)
        const allAssignments = await taskAssignmentRepository.find({ taskId: { $in: taskIds } });

        // Group assignments by taskId
        const assignmentsMap = {};
        for (const assignment of allAssignments) {
            const tId = assignment.taskId._id.toString();
            if (!assignmentsMap[tId]) {
                assignmentsMap[tId] = [];
            }
            assignmentsMap[tId].push(assignment);
        }

        const taskLists = tasks.map(task => {
            const taskObj = task.toObject();
            const assignments = assignmentsMap[task._id.toString()] || [];

            // Authoritative new TaskAssignment data array
            taskObj.assignments = assignments.map(a => ({
                assignmentId: a._id,
                assignee: a.assigneeId ? {
                    _id: a.assigneeId._id,
                    name: a.assigneeId.name,
                    user_id: a.assigneeId.user_id
                } : null,
                status: a.status,
                dueDate: a.dueDate,
                assignedAt: a.assignedAt,
                acknowledgedAt: a.acknowledgedAt,
                startedAt: a.startedAt,
                completedAt: a.completedAt
            }));

            // DEPRECATED compatibility fields (maintained to prevent breaking older views)
            taskObj.assignedTo = assignments.map(a => a.assigneeId).filter(Boolean);
            taskObj.status = assignments.length > 0 ? assignments[0].status : "Pending";

            return taskObj;
        });

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
        const loggedInUserId = req.user.id;
        const assignments = await taskAssignmentRepository.find({ assigneeId: loggedInUserId });

        // Map assignments to look like tasks for frontend compatibility
        const tasks = assignments.map(assignment => {
            if (!assignment.taskId) return null;
            const t = assignment.taskId.toObject();
            t.status = assignment.status;
            t.completedAt = assignment.completedAt;
            t.assignmentId = assignment._id;
            return t;
        }).filter(Boolean);

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
        const { status } = req.body;

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
        const updatedAssignment = await taskAssignmentService.updateStatus(assignment._id, status, req.user);

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