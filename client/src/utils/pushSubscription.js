import axios from 'axios';

// Helper to convert base64 VAPID key to UInt8Array for push manager subscription
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const subscribeToPushNotifications = async () => {
    try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push notifications are not supported in this browser.');
            return;
        }

        // Request browser permission to show notifications
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission was not granted.');
            return;
        }

        const registration = await navigator.serviceWorker.ready;

        // VAPID Public Key generated from server
        const vapidPublicKey = "BO8pXHFNiR95FudN_Ti8As7twT_KYZGbMeIsZA_ce4hdM7Twbeo49Gy-7q5uuLqPWhnFgfaDSrvb7NuVY5KE83s";

        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        // Save subscription object to backend database linked to user
        await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/subscribe`,
            { subscription },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log('PWA Push Notification subscription synced with backend successfully.');
    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
    }
};
