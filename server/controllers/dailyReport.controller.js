const DailyReport = require('../models/dailyReport.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const { getIO } = require('../utils/socketHelper');

// 1. SUBMIT DAILY REPORT (Admin)
const submitDailyReport = async (req, res) => {
    try {
        const { title, description, department, reportDate } = req.body;
        const loggedInUser = req.user;

        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Work details / description is required."
            });
        }

        // Auto-generate title if not provided
        const reportTitle = title && title.trim() ? title.trim() : `Daily Report - ${new Date(reportDate || Date.now()).toLocaleDateString("en-GB")}`;

        // Attachments parsing
        let attachments = [];
        if (req.files && req.files.length > 0) {
            attachments = req.files.map(file => ({
                fileName: file.originalname,
                fileUrl: `/uploads/${file.filename}`,
                fileSize: file.size
            }));
        }

        const newReport = await DailyReport.create({
            reportedBy: loggedInUser.id,
            department: department || loggedInUser.department || "general",
            title: reportTitle,
            description: description.trim(),
            reportDate: reportDate ? new Date(reportDate) : new Date(),
            attachments
        });

        const populatedReport = await DailyReport.findById(newReport._id)
            .populate("reportedBy", "name email role department mobile user_id");

        // Real-time Notification to Super Admin
        try {
            const superAdmins = await User.find({ role: "superadmin" });
            const io = getIO();

            for (const sa of superAdmins) {
                await Notification.create({
                    userId: sa._id,
                    title: "Daily Report Submitted 📄",
                    description: `${loggedInUser.name || 'Admin'} submitted daily report: "${reportTitle}"`,
                    type: "info",
                    taskTitle: reportTitle
                });

                if (io) {
                    io.to(sa._id.toString()).emit("newNotification", {
                        title: "Daily Report Submitted 📄",
                        description: `${loggedInUser.name || 'Admin'} submitted daily report: "${reportTitle}"`,
                        type: "info",
                        taskTitle: reportTitle
                    });
                }
            }
        } catch (notifErr) {
            console.error("Failed to send notification for daily report:", notifErr);
        }

        return res.status(201).json({
            success: true,
            message: "Daily report submitted successfully",
            report: populatedReport
        });

    } catch (error) {
        console.error("Submit Daily Report Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit daily report",
            error: error.message
        });
    }
};

// 2. GET MY DAILY REPORTS (Admin view)
const getMyDailyReports = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const reports = await DailyReport.find({ reportedBy: loggedInUserId })
            .sort({ reportDate: -1, createdAt: -1 })
            .populate("reportedBy", "name email role department mobile user_id");

        return res.status(200).json({
            success: true,
            message: "Fetched your daily reports successfully",
            reports
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch daily reports",
            error: error.message
        });
    }
};

// 3. GET ALL DAILY REPORTS (Super Admin view with filters)
const getAllDailyReports = async (req, res) => {
    try {
        const { department, adminId, startDate, endDate } = req.query;
        const filter = {};

        if (department && department !== "All") {
            filter.department = department.toLowerCase();
        }

        if (adminId && adminId !== "All") {
            filter.reportedBy = adminId;
        }

        if (startDate || endDate) {
            filter.reportDate = {};
            if (startDate) {
                filter.reportDate.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filter.reportDate.$lte = end;
            }
        }

        const reports = await DailyReport.find(filter)
            .sort({ reportDate: -1, createdAt: -1 })
            .populate("reportedBy", "name email role department mobile user_id");

        return res.status(200).json({
            success: true,
            message: "Fetched all daily reports successfully",
            reports
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch daily reports",
            error: error.message
        });
    }
};

module.exports = {
    submitDailyReport,
    getMyDailyReports,
    getAllDailyReports
};
