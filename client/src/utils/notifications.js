import axios from 'axios';

// Local storage se user token send karne ke liye helper headers
const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// 1. Backend database se real notifications fetch karna
export const getNotifications = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, getHeaders());
        if (response.data.success) {
            return response.data.notifications.map(n => ({
                id: n._id,
                title: n.title,
                description: n.description,
                time: (() => {
                    const d = new Date(n.createdAt);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    const formattedDate = `${day}/${month}/${year}`;
                    const formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    return `${formattedTime} ${formattedDate}`;
                })(),
                read: n.read,
                type: n.type,
                taskTitle: n.taskTitle,
                taskId: n.taskId,
                assignmentId: n.assignmentId
            }));
        }
        return [];
    } catch (e) {
        console.error("Error fetching notifications from server:", e);
        return [];
    }
};

// 2. Read / Unread toggle karna backend par
export const toggleNotificationRead = async (id) => {
    try {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}/toggle-read`, {}, getHeaders());
        window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (e) {
        console.error("Error toggling read status:", e);
    }
};

// 3. Sabhi notification read mark karna
export const markAllNotificationsAsRead = async () => {
    try {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/mark-all-read`, {}, getHeaders());
        window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (e) {
        console.error("Error marking all as read:", e);
    }
};

// 4. Sabhi notifications clear/delete karna
export const clearAllNotifications = async () => {
    try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/clear-all`, getHeaders());
        window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (e) {
        console.error("Error clearing notifications:", e);
    }
};
