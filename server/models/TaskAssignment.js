const mongoose = require("mongoose");

const taskAssignmentSchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        assigneeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        department: {
            type: String,
            enum: ["csr", "it", "hr", "interior", "sales", "accounts"],
            required: true,
        },
        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Completed",
                "Rejected",
                "Overdue",
            ],
            default: "Pending",
        },
        dueDate: {
            type: Date,
            required: true,
        },
        assignedAt: {
            type: Date,
            default: Date.now,
        },
        acknowledgedAt: {
            type: Date,
            default: null,
        },
        startedAt: {
            type: Date,
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
taskAssignmentSchema.index({ taskId: 1 });
taskAssignmentSchema.index({ assigneeId: 1 });
taskAssignmentSchema.index({ status: 1 });
taskAssignmentSchema.index({ dueDate: 1 });
// Compound index for employee dashboard (finding my tasks with specific status)
taskAssignmentSchema.index({ assigneeId: 1, status: 1 });

module.exports = mongoose.model("TaskAssignment", taskAssignmentSchema);
