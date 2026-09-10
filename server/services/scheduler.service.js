const TaskAssignment = require('../models/taskAssignment.model');
const Task = require('../models/task.model');
const Notification = require('../models/notification.model');
const { getIO } = require('../utils/socketHelper');
const { sendPushNotification } = require('./push.service');

/**
 * Smart Dynamic Task Reminder & Overdue System:
 * 
 * 1. Morning 10:00 AM Execution:
 *    - All reminders trigger during morning hours (10:00 AM onwards).
 * 
 * 2. Active Tasks only:
 *    - Reminders are sent only for incomplete tasks (status: "Pending" or "In Progress").
 * 
 * 3. Dynamic Milestone Reminders before deadline (to Assignee):
 *    - Long Tasks (Total duration > 6 days):
 *        * 40% Duration Elapsed Milestone: e.g. Day 4 of a 10-day task.
 *        * 3 Days Left: Warning reminder.
 *        * 2 Days Left: Urgent reminder.
 *        * Due Today (Final Day): Subah 10:00 AM alert with due time.
 *    - Short Tasks (Total duration <= 6 days):
 *        * 4 Days Left
 *        * 3 Days Left
 *        * 2 Days Left
 *        * Due Today (Final Day): Subah 10:00 AM alert with due time.
 * 
 * 4. Overdue Reminders (After deadline passed):
 *    - Sent daily at Morning 10:00 AM to BOTH Assignee and Assigner until marked "Completed".
 */
const checkTaskDeadlines = async () => {
    try {
        const now = new Date();
        const currentHour = now.getHours(); // 0 to 23
        const todayDateStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

        // Reminders run from Morning 10:00 AM window onwards
        if (currentHour < 10) {
            return;
        }

        // Fetch all active assignments with pending or in progress status
        const activeAssignments = await TaskAssignment.find({
            status: { $in: ["Pending", "In Progress"] }
        }).populate("taskId").populate("assigneeId").populate("assignedBy");

        const io = getIO();

        for (const assignment of activeAssignments) {
            if (!assignment.taskId) continue;

            const assignedAt = new Date(assignment.assignedAt || assignment.createdAt || now);
            const dueDate = new Date(assignment.dueDate);
            const dueTimeStr = assignment.dueTime || assignment.taskId.dueTime || "10:00";
            const [hours, minutes] = dueTimeStr.split(":").map(Number);

            // Construct exact deadline
            const deadline = new Date(dueDate);
            deadline.setHours(hours || 10, minutes || 0, 0, 0);

            const taskTitle = assignment.taskId.title || "Task";
            const assignee = assignment.assigneeId;
            const assigner = assignment.assignedBy;

            // Date calculations (in whole days)
            const MS_PER_DAY = 1000 * 60 * 60 * 24;

            // Normalize dates to midnight for day difference calculations
            const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const dueMidnight = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            const startMidnight = new Date(assignedAt.getFullYear(), assignedAt.getMonth(), assignedAt.getDate());

            const totalDurationDays = Math.max(1, Math.round((dueMidnight - startMidnight) / MS_PER_DAY));
            const daysRemaining = Math.round((dueMidnight - todayMidnight) / MS_PER_DAY);
            const daysElapsed = Math.round((todayMidnight - startMidnight) / MS_PER_DAY);

            const sentReminders = assignment.sentReminders || [];

            // ==========================================
            // CASE 1: OVERDUE TASK (Deadline has passed)
            // ==========================================
            if (now > deadline) {
                const lastReminderDateStr = assignment.lastOverdueReminderAt
                    ? new Date(assignment.lastOverdueReminderAt).toISOString().split("T")[0]
                    : null;

                const alreadySentToday = lastReminderDateStr === todayDateStr;

                if (!alreadySentToday) {
                    assignment.overdueNotified = true;
                    assignment.lastOverdueReminderAt = now;
                    await assignment.save();

                    // Alert to Assignee (Employee / Admin who received task)
                    if (assignee && assignee._id) {
                        const assigneeNotif = {
                            userId: assignee._id,
                            title: "⏰ Overdue Task Alert",
                            description: `Your assigned task "${taskTitle}" is overdue (Deadline was ${dueTimeStr}). Please complete and update your task status.`,
                            type: "warning",
                            taskTitle: taskTitle
                        };

                        await Notification.create(assigneeNotif);

                        if (io) {
                            try {
                                io.to(assignee._id.toString()).emit("newNotification", assigneeNotif);
                            } catch (e) {
                                console.error(`Socket emit error to assignee:`, e);
                            }
                        }

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

                    // Alert to Assigner (Super Admin / Admin who assigned task)
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
                                console.error(`Socket emit error to assigner:`, e);
                            }
                        }

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
                continue;
            }

            // ==============================================================
            // CASE 2: PRE-DEADLINE MILESTONE REMINDERS (To Assignee Only)
            // ==========================================
            let reminderTypeKey = null;
            let reminderTitle = "";
            let reminderBody = "";

            if (daysRemaining === 0) {
                // DUE TODAY (Final Day Alert)
                reminderTypeKey = `due_today_${todayDateStr}`;
                reminderTitle = "⏰ Final Day Task Reminder";
                reminderBody = `Task "${taskTitle}" is due today by ${dueTimeStr}. Please make sure to submit your work before the deadline.`;
            } else if (daysRemaining === 1) {
                // 1 DAY LEFT / TOMORROW
                reminderTypeKey = `1_day_left_${todayDateStr}`;
                reminderTitle = "⏳ Task Due Tomorrow";
                reminderBody = `Reminder: Task "${taskTitle}" is due tomorrow at ${dueTimeStr}. Please review your progress.`;
            } else if (daysRemaining === 2) {
                // 2 DAYS LEFT
                reminderTypeKey = `2_days_left_${todayDateStr}`;
                reminderTitle = "⏳ 2 Days Remaining";
                reminderBody = `Urgent Reminder: Only 2 days left to complete your assigned task "${taskTitle}".`;
            } else if (daysRemaining === 3) {
                // 3 DAYS LEFT
                reminderTypeKey = `3_days_left_${todayDateStr}`;
                reminderTitle = "📋 3 Days Remaining";
                reminderBody = `Reminder: 3 days remaining for task "${taskTitle}". Keep up the progress.`;
            } else if (daysRemaining === 4 && totalDurationDays <= 6) {
                // 4 DAYS LEFT (For short tasks duration <= 6 days)
                reminderTypeKey = `4_days_left_${todayDateStr}`;
                reminderTitle = "📋 Task Progress Reminder";
                reminderBody = `Reminder: 4 days remaining to complete task "${taskTitle}".`;
            } else if (totalDurationDays > 6) {
                // 40% MILESTONE FOR LONG TASKS (> 6 days)
                const milestoneDay40Percent = Math.round(totalDurationDays * 0.4);
                if (daysElapsed >= milestoneDay40Percent && daysElapsed < totalDurationDays - 3) {
                    reminderTypeKey = `40_percent_milestone_${totalDurationDays}`;
                    reminderTitle = "📌 Task Milestone Reminder";
                    reminderBody = `40% of the allocated time for task "${taskTitle}" has elapsed. Please ensure your progress is on track.`;
                }
            }

            // Trigger reminder if matched and not already sent for this key
            if (reminderTypeKey && !sentReminders.includes(reminderTypeKey)) {
                assignment.sentReminders.push(reminderTypeKey);
                await assignment.save();

                if (assignee && assignee._id) {
                    const milestoneNotif = {
                        userId: assignee._id,
                        title: reminderTitle,
                        description: reminderBody,
                        type: "info",
                        taskTitle: taskTitle
                    };

                    await Notification.create(milestoneNotif);

                    if (io) {
                        try {
                            io.to(assignee._id.toString()).emit("newNotification", milestoneNotif);
                        } catch (e) {
                            console.error("Socket emit error:", e);
                        }
                    }

                    try {
                        const targetUrl = assignee.role === "admin" ? "/admin-my-tasks" : "/employee-my-tasks";
                        sendPushNotification(assignee._id, {
                            title: reminderTitle,
                            body: reminderBody,
                            url: targetUrl
                        });
                    } catch (pushErr) {
                        console.error("Push error:", pushErr);
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
    // Initial check on server boot
    checkTaskDeadlines();

    // Check every 60 seconds (1 minute)
    setInterval(checkTaskDeadlines, 60 * 1000);
    console.log("⏰ Smart Milestone & 10:00 AM Overdue Task Reminder Scheduler active.");
};

module.exports = {
    checkTaskDeadlines,
    initTaskDeadlineScheduler
};
