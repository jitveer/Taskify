const TaskAssignment = require('../models/taskAssignment.model');
const Task = require('../models/task.model');
const Notification = require('../models/notification.model');
const { getIO } = require('../utils/socketHelper');
const { sendPushNotification } = require('./push.service');

/**
 * Checks all active task assignments (Pending or In Progress) that are OVERDUE.
 *
 * Rules:
 * 1. Triggers only when task due date/time has passed (Overdue).
 * 2. Sent daily during morning hours (10:00 AM onwards).
 * 3. Sent once per day per overdue task to both Assigner and Assignee until marked "Completed".
 * 4. Professional English notification text.
 */
const checkTaskDeadlines = async () => {
    try {
        const now = new Date();
        const currentHour = now.getHours(); // 0 to 23
        const todayDateStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

        // Sent only from Morning 10:00 AM window onwards
        if (currentHour < 10) {
            return;
        }

        // Find all incomplete active assignments (Pending or In Progress)
        const activeAssignments = await TaskAssignment.find({
            status: { $in: ["Pending", "In Progress"] }
        }).populate("taskId").populate("assigneeId").populate("assignedBy");

        const io = getIO();

        for (const assignment of activeAssignments) {
            if (!assignment.taskId) continue;

            const dueDate = new Date(assignment.dueDate);
            const dueTimeStr = assignment.dueTime || assignment.taskId.dueTime || "10:00";
            const [hours, minutes] = dueTimeStr.split(":").map(Number);

            // Construct exact task deadline
            const deadline = new Date(dueDate);
            deadline.setHours(hours || 10, minutes || 0, 0, 0);

            // 1. Check if task is OVERDUE
            if (now > deadline) {
                // 2. Check if today's reminder has already been sent
                const lastReminderDateStr = assignment.lastOverdueReminderAt 
                    ? new Date(assignment.lastOverdueReminderAt).toISOString().split("T")[0]
                    : null;

                const alreadySentToday = lastReminderDateStr === todayDateStr;

                if (!alreadySentToday) {
                    const taskTitle = assignment.taskId.title || "Task";
                    const assignee = assignment.assigneeId;
                    const assigner = assignment.assignedBy;

                    // Update timestamp & state in assignment
                    assignment.overdueNotified = true;
                    assignment.lastOverdueReminderAt = now;
                    await assignment.save();

                    // Notification 1: Assignee (Employee / Admin who received task)
                    if (assignee && assignee._id) {
                        const assigneeNotif = {
                            userId: assignee._id,
                            title: "⏰ Overdue Task Alert",
                            description: `Your assigned task "${taskTitle}" is overdue (Deadline: ${dueTimeStr}). Please complete and update your task status.`,
                            type: "warning",
                            taskTitle: taskTitle
                        };

                        await Notification.create(assigneeNotif);

                        if (io) {
                            try {
                                io.to(assignee._id.toString()).emit("newNotification", assigneeNotif);
                            } catch (e) {
                                console.error(`Socket emit error to assignee ${assignee._id}:`, e);
                            }
                        }

                        // Push notification to Assignee
                        try {
                            const targetUrl = assignee.role === "admin" ? "/admin-my-tasks" : "/employee-my-tasks";
                            sendPushNotification(assignee._id, {
                                title: assigneeNotif.title,
                                body: assigneeNotif.description,
                                url: targetUrl
                            });
                        } catch (pushErr) {
                            console.error("Push error:", pushErr);
                        }
                    }

                    // Notification 2: Assigner (Super Admin / Admin who assigned task)
                    if (assigner && assigner._id) {
                        const assignerNotif = {
                            userId: assigner._id,
                            title: "⚠️ Overdue Alert: Task Not Completed",
                            description: `${assignee ? assignee.name : "Assignee"} has not completed the task "${taskTitle}" within the scheduled deadline (${dueTimeStr}).`,
                            type: "warning",
                            taskTitle: taskTitle
                        };

                        await Notification.create(assignerNotif);

                        if (io) {
                            try {
                                io.to(assigner._id.toString()).emit("newNotification", assignerNotif);
                            } catch (e) {
                                console.error(`Socket emit error to assigner ${assigner._id}:`, e);
                            }
                        }

                        // Push notification to Assigner
                        try {
                            const targetUrl = assigner.role === "superadmin" ? "/task-status" : "/admin-task-status";
                            sendPushNotification(assigner._id, {
                                title: assignerNotif.title,
                                body: assignerNotif.description,
                                url: targetUrl
                            });
                        } catch (pushErr) {
                            console.error("Push error:", pushErr);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error running checkTaskDeadlines scheduler:", error);
    }
};

/**
 * Initializes the background interval scheduler (runs check periodically)
 */
const initTaskDeadlineScheduler = () => {
    // Run initial check on server boot
    checkTaskDeadlines();

    // Run interval every 60 seconds (1 minute)
    setInterval(checkTaskDeadlines, 60 * 1000);
    console.log("⏰ Morning 10:00 AM Overdue Task Reminder Scheduler active.");
};

module.exports = {
    checkTaskDeadlines,
    initTaskDeadlineScheduler
};
