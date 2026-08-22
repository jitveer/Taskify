const { authLoginService } = require('../services/auth.service');
const Subscription = require('../models/subscription.model');

// SUPERADMIN, ADMIN, EMPLOYEE LOGIN
const authLogin = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const data = await authLoginService(email, password, role);

        return res.status(200).json({
            success: true,
            message: "login Successful",
            ...data
        });

    } catch (e) {
        if (e.statusCode) {
            return res.status(e.statusCode).json({
                success: false,
                message: e.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: e.message,
        });
    }
}

// SUBSCRIBE TO PUSH NOTIFICATIONS
const subscribePush = async (req, res) => {
    try {
        const { subscription } = req.body;
        const userId = req.user.id;

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return res.status(400).json({
                success: false,
                message: "Subscription object is required."
            });
        }

        let existing = await Subscription.findOne({ userId, 'subscription.endpoint': subscription.endpoint });
        if (existing) {
            existing.subscription = subscription;
            await existing.save();
        } else {
            await Subscription.create({
                userId,
                subscription
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subscribed to push notifications successfully."
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Failed to subscribe to push notifications.",
            error: e.message
        });
    }
}

module.exports = { authLogin, subscribePush };