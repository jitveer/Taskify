const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TaskAssignment",
            default: null,
        },
        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true, // e.g. "CREATED", "STATUS_CHANGE", "ASSIGNED"
        },
        oldValue: {
            type: String,
            default: null,
        },
        newValue: {
            type: String,
            default: null,
        },
        source: {
            type: String,
            enum: ["WEB", "WHATSAPP", "SYSTEM", "API"],
            required: true,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // Only track createdAt
    }
);

// Indexes
taskHistorySchema.index({ taskId: 1 });
taskHistorySchema.index({ assignmentId: 1 });
taskHistorySchema.index({ actorId: 1 });
taskHistorySchema.index({ createdAt: 1 });

module.exports = mongoose.model("TaskHistory", taskHistorySchema);
