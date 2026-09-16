const Task = require('../models/task.model');

class TaskRepository {
    async create(taskData) {
        return await Task.create(taskData);
    }

    async findById(taskId) {
        return await Task.findById(taskId).populate("assignedBy", "name email role department");
    }

    async find(filter) {
        return await Task.find(filter).sort({ updatedAt: -1, createdAt: -1 }).populate("assignedBy", "name email role department");
    }

    async deleteById(taskId) {
        return await Task.findByIdAndDelete(taskId);
    }

    async countDocuments(filter = {}) {
        return await Task.countDocuments(filter);
    }
}

module.exports = new TaskRepository();