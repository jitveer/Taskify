const TaskHistory = require('../models/taskHistory.model');

class TaskHistoryRepository {
    async create(historyData) {
        return await TaskHistory.create(historyData);
    }

    async findByTaskId(taskId) {
        return await TaskHistory.find({ taskId }).populate("actorId", "name role department").sort({ createdAt: -1 });
    }

    async findByAssignmentId(assignmentId) {
        return await TaskHistory.find({ assignmentId }).populate("actorId", "name role department").sort({ createdAt: -1 });
    }

    async find(filter) {
        return await TaskHistory.find(filter).populate("actorId", "name role department").sort({ createdAt: -1 });
    }

    async deleteByTaskId(taskId) {
        return await TaskHistory.deleteMany({ taskId });
    }
}

module.exports = new TaskHistoryRepository();
