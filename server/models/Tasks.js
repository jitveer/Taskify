const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignedTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            }
        ],

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
            ref: "Department",
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

        completedAt: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true,
    }

);


//At liast one employee required
taskSchema.path("assignedTo").validate(function (value) {
    return value.length > 0;
}, "At least one employee madt be assigned to the task");


taskSchema.path("assignedTo").validate(function (value) {
    const uniqueIds = [...new Set(value.map(id => id.toString()))];
    return uniqueIds.length === value.length;
}, "Duplicate employees are not allowed");

module.exports = mongoose.model("Task", taskSchema);