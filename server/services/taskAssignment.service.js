const taskAssignmentRepository = require('../repositories/taskAssignment.repository');
const taskHistoryRepository = require('../repositories/taskHistory.repository');

class TaskAssignmentService {
    async getAssignmentsForEmployee(employeeId) {
        return await taskAssignmentRepository.find({ assigneeId: employeeId });
    }

    async getAssignmentsForAdmin(adminDepartment) {
        return await taskAssignmentRepository.find({ department: adminDepartment });
    }

    async getAssignmentsForSuperAdmin() {
        return await taskAssignmentRepository.find({});
    }





    async updateStatus(assignmentId, newStatus, actor, comment, attachment = null) {
        const assignment = await taskAssignmentRepository.findById(assignmentId);
        if (!assignment) {
            throw new Error("Task assignment not found");
        }

        // Authorize status update
        if (actor.role === "employee" && assignment.assigneeId._id.toString() !== actor.id) {
            throw new Error("You are not authorized to update this task assignment");
        }
        if (actor.role === "admin" && assignment.department !== actor.department) {
            throw new Error("You cannot update assignments outside your department");
        }

        const oldStatus = assignment.status;
        const progressCount = assignment.progressUpdates ? assignment.progressUpdates.length : 0;

        // 18 updates limit validation for In Progress
        if (newStatus === "In Progress" && progressCount >= 18) {
            throw new Error("Maximum limit of 18 progress updates reached for this task.");
        }

        // Check if nothing changed (no status change, no comment, no attachment)
        if (oldStatus === newStatus && !comment && !attachment) {
            return assignment;
        }

        // Validate status value
        const allowedStatuses = ["Pending", "In Progress", "Completed", "Rejected", "Overdue"];
        if (!allowedStatuses.includes(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }

        // State transition rules validation
        const transitionRules = {
            "Pending": ["In Progress", "Rejected"],
            "In Progress": ["In Progress", "Completed", "Rejected", "Pending"],
            "Rejected": ["Pending", "In Progress"],
            "Completed": [], // Reopening is not allowed through the normal status endpoint
            "Overdue": ["In Progress", "Completed"]
        };

        if (transitionRules[oldStatus] && !transitionRules[oldStatus].includes(newStatus)) {
            throw new Error(`State transition from ${oldStatus} to ${newStatus} is not allowed`);
        }

        // Set timestamps
        const now = new Date();
        const updateData = {
            status: newStatus,
            comment: comment || assignment.comment || ""
        };

        if (newStatus === "In Progress") {
            if (!assignment.acknowledgedAt) {
                updateData.acknowledgedAt = now;
            }
            if (!assignment.startedAt) {
                updateData.startedAt = now;
            }
        } else if (newStatus === "Completed") {
            updateData.completedAt = now;
        }

        // Progress entry push karna (har update ka record)
        const progressEntry = {
            status: newStatus,
            comment: comment || "",
            attachment: attachment || null,
            updatedAt: now
        };

        updateData.$push = { progressUpdates: progressEntry };

        const updatedAssignment = await taskAssignmentRepository.updateById(assignmentId, updateData);

        // Record history log
        await taskHistoryRepository.create({
            taskId: assignment.taskId._id,
            assignmentId: assignment._id,
            actorId: actor.id,
            action: "STATUS_CHANGE",
            oldValue: oldStatus,
            newValue: newStatus,
            source: "WEB",
            comment: comment || null,
            metadata: attachment ? { attachment } : {}
        });


        // Save database notification & emit via socket for in-app UI display
        try {
            const Notification = require('../models/notification.model');
            const { getIO } = require('../utils/socketHelper'); // <--- Socket helper import kiya
            const io = getIO();

            const assignerId = updatedAssignment.assignedBy?._id || updatedAssignment.assignedBy;
            const assigneeName = updatedAssignment.assigneeId?.name || "Employee";
            const taskTitle = updatedAssignment.taskId?.title || "Task";

            if (assignerId) {
                // 1. DB me save karein
                await Notification.create({
                    userId: assignerId,
                    title: "Task Status Updated 🔄",
                    description: `${assigneeName} updated task "${taskTitle}" to "${newStatus}"`,
                    type: "info",
                    taskTitle: taskTitle
                });

                // 2. Assigner (Admin/Super Admin) ke room me real-time emit karein
                try {
                    io.to(assignerId.toString()).emit("newNotification", {
                        title: "Task Status Updated 🔄",
                        description: `${assigneeName} updated task "${taskTitle}" to "${newStatus}"`,
                        type: "info",
                        taskTitle: taskTitle
                    });
                } catch (socketErr) {
                    console.error("Failed to emit status update socket notification:", socketErr);
                }
            }
        } catch (err) {
            console.error("Failed to save database notification for status update:", err);
        }









        // Trigger push notifications asynchronously
        try {
            const { sendPushNotification } = require('./push.service');
            const assignerId = updatedAssignment.assignedBy._id || updatedAssignment.assignedBy;
            const assigneeName = updatedAssignment.assigneeId.name;
            const taskTitle = updatedAssignment.taskId.title;
            const assignerRole = updatedAssignment.assignedBy.role;
            const targetUrl = assignerRole === "superadmin" ? "/task-status" : "/admin-task-status";

            sendPushNotification(assignerId, {
                title: "Task Status Updated 🔄",
                body: `${assigneeName} updated task "${taskTitle}" to "${newStatus}"`,
                url: targetUrl
            });
        } catch (err) {
            console.error("Failed to trigger status update push notification:", err);
        }

        return updatedAssignment;
    }
}

module.exports = new TaskAssignmentService();
