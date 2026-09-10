const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema(
    {
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        department: {
            type: String,
            enum: ["csr", "it", "hr", "interior", "sales", "accounts"],
            required: true,
        },
        title: {
            type: String,
            default: "",
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: true,
        },
        reportDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        attachments: [
            {
                fileName: {
                    type: String,
                    trim: true,
                },
                fileUrl: {
                    type: String,
                    trim: true,
                },
                fileSize: {
                    type: Number,
                },
            }
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes for fast searching and filtering
dailyReportSchema.index({ reportedBy: 1 });
dailyReportSchema.index({ department: 1 });
dailyReportSchema.index({ reportDate: -1 });

module.exports = mongoose.model("DailyReport", dailyReportSchema);
