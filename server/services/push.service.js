const webpush = require('web-push');
const Subscription = require('../models/subscription.model');

// Configure VAPID keys
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(
        'mailto:admin@taskify.com',
        vapidPublicKey,
        vapidPrivateKey
    );
} else {
    console.error('VAPID keys not configured in environment variables.');
}

/**
 * Sends a push notification to all active subscriptions of a user
 * @param {string} userId - ID of the user
 * @param {object} payload - Notification payload { title, body, url }
 */
const sendPushNotification = async (userId, payload) => {
    try {
        const subscriptions = await Subscription.find({ userId });
        
        if (!subscriptions || subscriptions.length === 0) {
            return;
        }

        const payloadString = JSON.stringify(payload);

        const sendPromises = subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(sub.subscription, payloadString);
            } catch (error) {
                // If subscription has expired or is no longer valid, delete it
                if (error.statusCode === 410 || error.statusCode === 404) {
                    console.log(`Removing expired subscription for user ${userId}`);
                    await Subscription.deleteOne({ _id: sub._id });
                } else {
                    console.error('Error sending push notification:', error);
                }
            }
        });

        await Promise.all(sendPromises);
    } catch (err) {
        console.error('Failed to send push notifications:', err);
    }
};

module.exports = {
    sendPushNotification
};
