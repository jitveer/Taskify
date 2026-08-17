const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        taskType: {
            type: String,
            enum: [
                "individual",
                "group_task",
            ],
            required: true,
        },

        department: {
            type: String,
            enum: ["csr", "it", "hr", "interior", "sales", "accounts"],
            required: function () {
                return this.taskType === "group_task";
            }
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        description: {
            type: String,
            required: true,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        parentTaskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        },

        attachments: [
            {
                fileName: {
                    type: String,
                    trim: true
                },
                fileUrl: {
                    type: String,
                    trim: true,
                },
            }
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes
taskSchema.index({ assignedBy: 1 });
taskSchema.index({ department: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);