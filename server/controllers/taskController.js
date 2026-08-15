const mongoose = require('mongoose');
const taskTable = require('../models/Tasks');


//LIST TASKS
const taskList = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const taskLists = await taskTable.find({ assignedBy: loggedInUserId }).populate("assignedTo", "name user_id");

        if (taskLists) {
            return res.status(200).json({
                success: true,
                message: "Successfully got Task List",
                assignedTasks: taskLists
            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to get tasks"
        })
    }
}


//ADD TASKS
const addTask = async (req, res) => {
    try {
        const taskData = req.body;

        // 1. Array Parsing: FormData ki wajah se 'assignedTo' string ban jata hai, use Javascript array me convert karna
        if (taskData.assignedTo && typeof taskData.assignedTo === "string") {
            try {
                taskData.assignedTo = JSON.parse(taskData.assignedTo);
            } catch (error) {
                // Agar parse fail ho toh single ID ko array me convert karein
                taskData.assignedTo = [taskData.assignedTo];
            }
        }

        // 2. Attachments Handling: Uploaded files ko database entry me add karna
        if (req.files && req.files.length > 0) {
            taskData.attachments = req.files.map(file => {
                return {
                    fileName: file.originalname,
                    fileUrl: `/uploads/${file.filename}`
                };
            });
        }

        // 3. Creator Assignment
        taskData.assignedBy = req.user.id;

        // 4. Admin ke liye automatically department force karna
        if (req.user.role === "admin") {
            taskData.department = req.user.department;
        }

        const newTask = await taskTable.create(taskData);

        if (!newTask) {
            return res.status(400).json({
                success: false,
                message: "Adding Task Failed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task Successfully Added",
            task: newTask
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }
};




const getMyTasks = async (req, res) => {
    try {
        const loggedInUserId = new mongoose.Types.ObjectId(req.user.id);
        const tasks = await taskTable.find({ assignedTo: loggedInUserId }).populate("assignedBy", "name email");

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



const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;

        const updatedTask = await taskTable.findByIdAndUpdate(
            id,
            { status, comment, completedAt: status === "Completed" ? new Date() : null },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            task: updatedTask
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