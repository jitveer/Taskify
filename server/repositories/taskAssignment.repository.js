const TaskAssignment = require('../models/taskAssignment.model');

class TaskAssignmentRepository {
    async create(assignmentData) {
        return await TaskAssignment.create(assignmentData);
    }

    async findById(assignmentId) {
        return await TaskAssignment.findById(assignmentId)
            .populate({
                path: "taskId",
                populate: {
                    path: "assignedBy",
                    select: "name email role department"
                }
            })
            .populate("assigneeId", "name email role department mobile user_id")
            .populate("assignedBy", "name email role department");
    }

    async find(filter) {
        return await TaskAssignment.find(filter)
            .populate({
                path: "taskId",
                populate: {
                    path: "assignedBy",
                    select: "name email role department"
                }
            })
            .populate("assigneeId", "name email role department mobile user_id")
            .populate("assignedBy", "name email role department");
    }

    async findOne(filter) {
        return await TaskAssignment.findOne(filter)
            .populate({
                path: "taskId",
                populate: {
                    path: "assignedBy",
                    select: "name email role department"
                }
            })
            .populate("assigneeId", "name email role department mobile user_id")
            .populate("assignedBy", "name email role department");
    }

    async updateById(assignmentId, updateData) {
        return await TaskAssignment.findByIdAndUpdate(assignmentId, updateData, { new: true })
            .populate({
                path: "taskId",
                populate: {
                    path: "assignedBy",
                    select: "name email role department"
                }
            })
            .populate("assigneeId", "name email role department mobile user_id")
            .populate("assignedBy", "name email role department");
    }

    async deleteByTaskId(taskId) {
        return await TaskAssignment.deleteMany({ taskId });
    }

    async countDocuments(filter) {
        return await TaskAssignment.countDocuments(filter);
    }
}

module.exports = new TaskAssignmentRepository();
