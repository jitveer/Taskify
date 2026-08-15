import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { getNotifications, saveNotifications, toggleNotificationRead, markAllNotificationsAsRead, clearAllNotifications } from "../../utils/notifications";
import { ShieldAlert, CheckCircle2, Clock, Bell, Trash2, CheckSquare } from "lucide-react";

function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    // Get logged in user details to determine role and sidebar color
    const user = JSON.parse(localStorage.getItem("user")) || { role: "employee" };
    const role = user.role; // "superadmin", "admin", "employee"

    // Set configuration based on role
    let displayRole = "Employee";
    let sidebarColor = "emerald"; // default employee color
    let taskListPath = "/employee-my-tasks";

    if (role === "superadmin") {
        displayRole = "Super Admin";
        sidebarColor = "purple";
        taskListPath = "/my-tasks";
    } else if (role === "admin") {
        displayRole = "Admin";
        sidebarColor = "blue";
        taskListPath = "/admin-my-tasks";
    }

    const getRoleMenuItems = () => {
        if (role === "superadmin") {
            return [
                { name: "Dashboard", path: "/super-admin-dashboard" },
                { name: "Admin List", path: "/admin-list" },
                { name: "Employee List", path: "/employee-list" },
                { name: "Add Task", path: "/assign-task" },
                // { name: "Task List", path: "/my-tasks" },
                { name: "Tasks Assigned by Me", path: "/task-status" },
                { name: "Reports", path: "/reports" }
            ];
        } else if (role === "admin") {
            return [
                { name: "Dashboard", path: "/admin-dashboard" },
                { name: "Employee List", path: "/admin-employee-list" },
                { name: "Add Task", path: "/admin-assign-task" },
                { name: "My Tasks", path: "/admin-my-tasks" },
                { name: "Tasks Assigned by Me", path: "/admin-task-status" },
                { name: "Reports", path: "/admin-reports" }
            ];
        } else {
            return [
                { name: "Dashboard", path: "/employee-dashboard" },
                { name: "My Tasks", path: "/employee-my-tasks" },
                { name: "Reports", path: "/employee-reports" },
                { name: "My Profile", path: "/employee-profile" }
            ];
        }
    };

    const menuItems = getRoleMenuItems();

    useEffect(() => {
        const updateNotifications = () => {
            setNotifications(getNotifications());
        };
        updateNotifications();
        window.addEventListener("notificationsUpdated", updateNotifications);
        return () => window.removeEventListener("notificationsUpdated", updateNotifications);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case "alert":
                return <ShieldAlert className="text-purple-600 w-5 h-5" />;
            case "success":
                return <CheckCircle2 className="text-emerald-600 w-5 h-5" />;
            case "info":
            default:
                return <Clock className="text-blue-600 w-5 h-5" />;
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case "alert":
                return "bg-purple-100";
            case "success":
                return "bg-emerald-100";
            case "info":
            default:
                return "bg-blue-100";
        }
    };

    const handleNotificationClick = (notif) => {
        // Mark as read first
        toggleNotificationRead(notif.id);

        // Go to task list of that notification
        if (notif.taskTitle) {
            navigate(`${taskListPath}?search=${encodeURIComponent(notif.taskTitle)}`);
        } else {
            navigate(taskListPath);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role={displayRole} menuItems={menuItems} color={sidebarColor} />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full overflow-hidden">
                {/* Header */}
                <Header title="Notifications" role={displayRole} />

                <div className="p-4 lg:p-8 max-w-4xl mx-auto pb-24 lg:pb-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                        {/* Title Bar & Quick Actions */}
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/30">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Notification Center</h2>
                                <p className="text-xs text-slate-500 mt-1 font-medium">Keep track of updates, tasks, and reports.</p>
                            </div>

                            {notifications.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={markAllNotificationsAsRead}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${sidebarColor === "purple"
                                            ? "text-purple-600 border-purple-100 bg-purple-50 hover:bg-purple-100"
                                            : sidebarColor === "blue"
                                                ? "text-blue-600 border-blue-100 bg-blue-50 hover:bg-blue-100"
                                                : "text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                                            }`}
                                    >
                                        <CheckSquare size={14} />
                                        Mark all as read
                                    </button>

                                    <button
                                        onClick={clearAllNotifications}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                                    >
                                        <Trash2 size={14} />
                                        Clear all
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* List */}
                        <div className="divide-y divide-slate-100">
                            {notifications.length === 0 ? (
                                <div className="p-16 text-center flex flex-col items-center justify-center">
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 border transition-colors ${sidebarColor === "purple"
                                        ? "bg-purple-50 text-purple-500 border-purple-100"
                                        : sidebarColor === "blue"
                                            ? "bg-blue-50 text-blue-500 border-blue-100"
                                            : "bg-emerald-50 text-emerald-500 border-emerald-100"
                                        }`}>
                                        <Bell size={28} />
                                    </div>
                                    <h3 className="text-slate-800 font-bold text-base">No notifications yet</h3>
                                    <p className="text-slate-500 text-xs mt-1.5 max-w-sm">When you get updates about assigned tasks or reports, they'll appear here.</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-6 flex gap-4 hover:bg-slate-50/80 transition-all cursor-pointer relative ${!notif.read ? "bg-slate-50/30" : ""
                                            }`}
                                    >
                                        {/* Unread Left Border Line */}
                                        {!notif.read && (
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-md ${sidebarColor === "purple" ? "bg-purple-600" : sidebarColor === "blue" ? "bg-blue-600" : "bg-emerald-600"
                                                }`}></div>
                                        )}

                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${getIconBg(notif.type)}`}>
                                            {getIcon(notif.type)}
                                        </div>

                                        {/* Body */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                                <h3 className={`text-sm lg:text-base leading-snug ${notif.read ? "text-slate-700 font-medium" : "text-slate-900 font-bold"
                                                    }`}>
                                                    {notif.title}
                                                </h3>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap self-start sm:self-auto">
                                                    {notif.time}
                                                </span>
                                            </div>

                                            <p className="text-xs lg:text-sm text-slate-500 mt-1.5 leading-relaxed">
                                                {notif.description}
                                            </p>

                                            {notif.taskTitle && (
                                                <div className="mt-3 flex items-center gap-1.5">
                                                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${sidebarColor === "purple" ? "bg-purple-600" : sidebarColor === "blue" ? "bg-blue-600" : "bg-emerald-600"
                                                        }`}></span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        Linked Task: {notif.taskTitle}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notifications;
