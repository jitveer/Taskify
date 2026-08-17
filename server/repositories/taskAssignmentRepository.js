const TaskAssignment = require("../models/TaskAssignment");

class TaskAssignmentRepository {
    async create(assignmentData) {
        return await TaskAssignment.create(assignmentData);
    }

    async findById(assignmentId) {
        return await TaskAssignment.findById(assignmentId)
            .populate("taskId")
            .populate("assigneeId", "name email role department mobile user_id")
            .populate("assignedBy", "name email role department");
    }

    async find(filter) {
        return await TaskAssignment.find(filter)
            .populate("taskId")
            .populate("assigneeId", "name email role department mobile user_id")
            .populate("assignedBy", "name email role department");
    }

    async findOne(filter) {
        return await TaskAssignment.findOne(filter)
            .populate("taskId")
            .populate("assigneeId", "name email role department mobile user_id")
            .populate("assignedBy", "name email role department");
    }

    async updateById(assignmentId, updateData) {
        return await TaskAssignment.findByIdAndUpdate(assignmentId, updateData, { new: true });
    }

    async deleteByTaskId(taskId) {
        return await TaskAssignment.deleteMany({ taskId });
    }
}

module.exports = new TaskAssignmentRepository();
