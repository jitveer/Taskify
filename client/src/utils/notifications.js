const DEFAULT_NOTIFICATIONS = [
    {
        id: 1,
        title: "New Task Assigned",
        description: "You have been assigned the UI Dashboard Design task.",
        time: "10 mins ago",
        read: false,
        type: "alert",
        taskTitle: "UI Dashboard Design"
    },
    {
        id: 2,
        title: "Task Update Needed",
        description: "Sarah Smith requested updates on the Backend API Integration task.",
        time: "2 hours ago",
        read: false,
        type: "success",
        taskTitle: "Backend API Integration"
    },
    {
        id: 3,
        title: "Deadline Approaching",
        description: "Attendance Module task is due in 3 days.",
        time: "1 day ago",
        read: true,
        type: "info",
        taskTitle: "Attendance Module"
    },
    {
        id: 4,
        title: "New Employee Joined",
        description: "Brundha S (EMP001) joined the CSR department.",
        time: "3 hours ago",
        read: false,
        type: "info"
    },
    {
        id: 5,
        title: "Task Priority Escalated",
        description: "Priority of 'Backend API Integration' has been raised to High.",
        time: "5 hours ago",
        read: false,
        type: "alert",
        taskTitle: "Backend API Integration"
    },
    {
        id: 6,
        title: "Monthly Report Ready",
        description: "The monthly department performance report is ready to download.",
        time: "Yesterday",
        read: true,
        type: "success"
    }
];

export const getNotifications = () => {
    const data = localStorage.getItem("notifications");
    const version = localStorage.getItem("notifications_version");
    if (!data || version !== "2") {
        localStorage.setItem("notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
        localStorage.setItem("notifications_version", "2");
        window.dispatchEvent(new Event("notificationsUpdated"));
        return DEFAULT_NOTIFICATIONS;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_NOTIFICATIONS;
    }
};

export const saveNotifications = (notifications) => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
    window.dispatchEvent(new Event("notificationsUpdated"));
};

export const toggleNotificationRead = (id) => {
    const notifs = getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
};

export const markAllNotificationsAsRead = () => {
    const notifs = getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
};

export const clearAllNotifications = () => {
    saveNotifications([]);
};
