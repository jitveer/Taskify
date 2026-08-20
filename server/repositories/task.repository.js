const Task = require('../models/task.model');

class TaskRepository {
    async create(taskData) {
        return await Task.create(taskData);
    }

    async findById(taskId) {
        return await Task.findById(taskId).populate("assignedBy", "name email role department");
    }

    async find(filter) {
        return await Task.find(filter).populate("assignedBy", "name email role department");
    }

    async deleteById(taskId) {
        return await Task.findByIdAndDelete(taskId);
    }
}

module.exports = new TaskRepository();