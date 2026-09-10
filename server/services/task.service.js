const taskRepository = require('../repositories/task.repository');
const taskAssignmentRepository = require('../repositories/taskAssignment.repository');
const taskHistoryRepository = require('../repositories/taskHistory.repository');
const userRepository = require('../repositories/user.repository');

class TaskService {
    async createTask(taskData, assigneeIds, creator) {
        if (!assigneeIds || assigneeIds.length === 0) {
            throw new Error("At least one assignee is required.");
        }

        if (!taskData.dueDate) {
            throw new Error("Due date is required.");
        }

        const taskDueDate = new Date(taskData.dueDate);
        if (isNaN(taskDueDate.getTime())) {
            throw new Error("Invalid due date.");
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compareDueDate = new Date(taskData.dueDate);
        compareDueDate.setHours(0, 0, 0, 0);

        if (compareDueDate < today) {
            throw new Error("Due date cannot be in the past.");
        }

        taskData.assignedBy = creator.id;

        const assignees = await userRepository.find({ _id: { $in: assigneeIds } });
        if (assignees.length !== assigneeIds.length) {
            throw new Error("One or more assigned employees do not exist.");
        }

        for (const emp of assignees) {
            if (emp.role !== "employee" && emp.role !== "admin") {
                throw new Error(`User ${emp.name} is not an employee or admin and cannot be assigned tasks.`);
            }
            if (creator.role === "admin" && emp.department !== creator.department) {
                throw new Error(`Admin cannot assign tasks to employee ${emp.name} from a different department.`);
            }
        }

        if (taskData.taskType === "group_task" && !taskData.department) {
            if (creator.role === "admin") {
                taskData.department = creator.department;
            } else {
                throw new Error("Department is required for group tasks.");
            }
        }

        if (!taskData.dueTime || !taskData.dueTime.trim()) {
            taskData.dueTime = "10:00";
        }

        const task = await taskRepository.create(taskData);

        const assignments = [];
        for (const emp of assignees) {
            let dept = taskData.taskType === "group_task" ? taskData.department : emp.department;
            if (dept) {
                dept = dept.toLowerCase();
            }
            const assignment = await taskAssignmentRepository.create({
                taskId: task._id,
                assigneeId: emp._id,
                assignedBy: creator.id,
                department: dept,
                dueDate: task.dueDate,
                dueTime: task.dueTime,
                status: "Pending"
            });
            assignments.push(assignment);
        }

        await taskHistoryRepository.create({
            taskId: task._id,
            actorId: creator.id,
            action: "CREATED",
            oldValue: null,
            newValue: task.title,
            source: "WEB",
            metadata: { assigneeCount: assigneeIds.length }
        });

        // Trigger push notifications asynchronously
        try {
            const { sendPushNotification } = require('./push.service');
            assignees.forEach(emp => {
                const targetUrl = emp.role === "admin" ? "/admin-my-tasks" : "/employee-my-tasks";
                sendPushNotification(emp._id, {
                    title: "New Task Assigned 📋",
                    body: `${creator.name} assigned you a task: "${task.title}"`,
                    url: targetUrl
                });
            });
        } catch (err) {
            console.error("Failed to trigger task assignment push notifications:", err);
        }

        // Save database notifications for in-app UI display
        // try {
        //     const Notification = require('../models/notification.model');
        //     const notifPromises = assignees.map(emp => {
        //         return Notification.create({
        //             userId: emp._id,
        //             title: "New Task Assigned 📋",
        //             description: `${creator.name} assigned you a task: "${task.title}"`,
        //             type: "alert",
        //             taskTitle: task.title
        //         });
        //     });
        //     await Promise.all(notifPromises);
        // } catch (err) {
        //     console.error("Failed to save database notifications:", err);
        // }



        // Save database notifications for in-app UI display
        try {
            const Notification = require('../models/notification.model');
            const { getIO } = require('../utils/socketHelper'); // <--- Socket helper import kiya
            const io = getIO();

            const notifPromises = assignees.map(async (emp) => {
                // 1. DB me save karein
                await Notification.create({
                    userId: emp._id,
                    title: "New Task Assigned 📋",
                    description: `${creator.name} assigned you a task: "${task.title}"`,
                    type: "alert",
                    taskTitle: task.title
                });

                // 2. Us employee ke room me real-time emit karein
                try {
                    io.to(emp._id.toString()).emit("newNotification", {
                        title: "New Task Assigned 📋",
                        description: `${creator.name} assigned you a task: "${task.title}"`,
                        type: "alert",
                        taskTitle: task.title
                    });
                } catch (socketErr) {
                    console.error(`Failed to emit task socket notification to ${emp._id}:`, socketErr);
                }
            });

            await Promise.all(notifPromises);
        } catch (err) {
            console.error("Failed to save database notifications:", err);
        }







        return { task, assignments };
    }

    async getTaskLists(loggedInUserId) {
        const tasks = await taskRepository.find({ assignedBy: loggedInUserId });
        const taskIds = tasks.map(t => t._id);

        const allAssignments = await taskAssignmentRepository.find({ taskId: { $in: taskIds } });
        const allHistories = await taskHistoryRepository.find({ taskId: { $in: taskIds }, action: "STATUS_CHANGE" });

        const assignmentsMap = {};
        for (const assignment of allAssignments) {
            const tId = assignment.taskId._id.toString();
            if (!assignmentsMap[tId]) {
                assignmentsMap[tId] = [];
            }
            assignmentsMap[tId].push(assignment);
        }

        const historyMap = {};
        for (const history of allHistories) {
            const aId = history.assignmentId ? history.assignmentId.toString() : "general";
            if (!historyMap[aId]) {
                historyMap[aId] = [];
            }
            historyMap[aId].push({
                action: history.action,
                oldValue: history.oldValue,
                newValue: history.newValue,
                comment: history.comment,
                createdAt: history.createdAt,
                actor: history.actorId ? {
                    name: history.actorId.name,
                    role: history.actorId.role
                } : null
            });
        }

        const taskLists = tasks.map(task => {
            const taskObj = task.toObject();
            const assignments = assignmentsMap[task._id.toString()] || [];

            taskObj.assignments = assignments.map(a => ({
                assignmentId: a._id,
                assignee: a.assigneeId ? {
                    _id: a.assigneeId._id,
                    name: a.assigneeId.name,
                    user_id: a.assigneeId.user_id
                } : null,
                status: a.status,
                comment: a.comment,
                history: historyMap[a._id.toString()] || [],
                dueDate: a.dueDate,
                dueTime: a.dueTime || task.dueTime || "10:00",
                assignedAt: a.assignedAt,
                acknowledgedAt: a.acknowledgedAt,
                startedAt: a.startedAt,
                completedAt: a.completedAt,
                progressUpdates: a.progressUpdates || []
            }));

            taskObj.assignedTo = assignments.map(a => a.assigneeId).filter(Boolean);
            taskObj.status = assignments.length > 0 ? assignments[0].status : "Pending";
            taskObj.comment = assignments.length > 0 ? assignments[0].comment : "";
            taskObj.progressUpdates = assignments.length > 0 ? (assignments[0].progressUpdates || []) : [];
            taskObj.dueTime = task.dueTime || (assignments.length > 0 ? assignments[0].dueTime : "10:00") || "10:00";

            return taskObj;
        });

        return taskLists;
    }

    async getMyTasks(loggedInUserId) {
        const assignments = await taskAssignmentRepository.find({ assigneeId: loggedInUserId });

        const tasks = assignments.map(assignment => {
            if (!assignment.taskId) return null;
            const t = assignment.taskId.toObject();
            t.status = assignment.status;
            t.comment = assignment.comment;
            t.completedAt = assignment.completedAt;
            t.assignmentId = assignment._id;
            t.dueTime = assignment.dueTime || t.dueTime || "10:00";
            t.progressUpdates = assignment.progressUpdates || [];
            return t;
        }).filter(Boolean);

        return tasks;
    }
}

module.exports = new TaskService();
