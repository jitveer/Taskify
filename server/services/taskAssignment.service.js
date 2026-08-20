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

    async updateStatus(assignmentId, newStatus, actor, comment) {
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
        if (oldStatus === newStatus) {
            return assignment; // No changes needed
        }

        // Validate status value
        const allowedStatuses = ["Pending", "In Progress", "Completed", "Rejected", "Overdue"];
        if (!allowedStatuses.includes(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }

        // State transition rules validation
        // Normal flow: Pending -> In Progress -> Completed
        // Rejections: Pending / In Progress -> Rejected
        // Normal status endpoint does not allow reopening a Completed task.
        const transitionRules = {
            "Pending": ["In Progress", "Rejected"],
            "In Progress": ["Completed", "Rejected", "Pending"],
            "Rejected": ["Pending", "In Progress"],
            "Completed": [], // Reopening is not allowed through the normal status endpoint
            "Overdue": ["In Progress", "Completed"]
        };

        if (transitionRules[oldStatus] && !transitionRules[oldStatus].includes(newStatus)) {
            throw new Error(`State transition from ${oldStatus} to ${newStatus} is not allowed`);
        }

        // Set timestamps
        const updateData = { status: newStatus, comment: comment || "" };
        const now = new Date();

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
            comment: comment || null
        });

        return updatedAssignment;
    }
}

module.exports = new TaskAssignmentService();
