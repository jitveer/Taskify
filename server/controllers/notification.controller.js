const Notification = require('../models/notification.model');

// 1. Get all notifications for logged-in user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, notifications });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Mark single notification as read (Strictly user-scoped to prevent IDOR)
const toggleRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const notif = await Notification.findOne({ _id: id, userId });
        if (!notif) {
            return res.status(404).json({
                success: false,
                message: "Notification not found or access denied."
            });
        }
        notif.read = true;
        await notif.save();
        return res.status(200).json({ success: true, notification: notif });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Mark all as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.updateMany({ userId, read: false }, { read: true });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Clear all notifications
const clearAll = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.deleteMany({ userId });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getNotifications,
    toggleRead,
    markAllAsRead,
    clearAll
};

