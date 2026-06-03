import { useState, useEffect, useRef } from "react";
import { Menu, Bell, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

function Header({ title, role }) {
    const showHamburger = role === "Admin" || role === "Super Admin";
    const headerRef = useRef(null);

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Admin Registered",
            description: "John Doe has registered as an Admin for the HR department.",
            time: "10 mins ago",
            read: false,
            type: "alert"
        },
        {
            id: 2,
            title: "Task Completed",
            description: "Sarah Smith completed the Backend API Integration task.",
            time: "2 hours ago",
            read: false,
            type: "success"
        },
        {
            id: 3,
            title: "Report Generated",
            description: "The monthly operations report for May is ready.",
            time: "1 day ago",
            read: true,
            type: "info"
        }
    ]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case "alert":
                return {
                    icon: <ShieldAlert className="text-purple-600 w-5 h-5" />,
                    bg: "bg-purple-100"
                };
            case "success":
                return {
                    icon: <CheckCircle2 className="text-emerald-600 w-5 h-5" />,
                    bg: "bg-emerald-100"
                };
            case "info":
            default:
                return {
                    icon: <Clock className="text-blue-600 w-5 h-5" />,
                    bg: "bg-blue-100"
                };
        }
    };

    const toggleRead = (id) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    // Close notifications dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (headerRef.current && !headerRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-40">
            {/* Left Side */}
            <div className="flex items-center gap-3">
                {/* Hamburger menu for Admin/SuperAdmin on mobile/tablet */}
                {showHamburger && (
                    <button
                        className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                        onClick={() => window.dispatchEvent(new Event("toggleSidebar"))}
                    >
                        <Menu size={20} />
                    </button>
                )}

                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight whitespace-nowrap">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 md:gap-4">
                {/* Notification Group */}
                <div className="relative" ref={headerRef}>
                    <button
                        onClick={() => setShowNotifications(prev => !prev)}
                        className="relative p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 transition border border-slate-100"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <>
                            <style>{`
                                @keyframes fadeInSlideDown {
                                    from {
                                        opacity: 0;
                                        transform: translateY(-8px) scale(0.98);
                                    }
                                    to {
                                        opacity: 1;
                                        transform: translateY(0) scale(1);
                                    }
                                }
                            `}</style>
                            <div
                                style={{
                                    animation: "fadeInSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                                }}
                                className="absolute top-[52px] right-0 w-[calc(100vw-32px)] sm:w-[400px] bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/80 z-50 overflow-hidden origin-top-right"
                            >
                                {/* Header */}
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="bg-purple-100 text-purple-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs font-bold text-purple-600 hover:text-purple-700 transition"
                                        >
                                            Mark all
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-50">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-3">
                                                <Bell size={20} />
                                            </div>
                                            <p className="text-slate-500 font-medium text-xs">No notifications yet</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif) => {
                                            const config = getNotificationIcon(notif.type);
                                            return (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => toggleRead(notif.id)}
                                                    className={`p-4 flex gap-3.5 hover:bg-slate-50/80 transition cursor-pointer relative ${!notif.read ? "bg-purple-50/10" : ""
                                                        }`}
                                                >
                                                    {!notif.read && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-md"></div>
                                                    )}

                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                                                        {config.icon}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <p className={`text-xs leading-snug ${notif.read ? "text-slate-600" : "text-slate-800 font-bold"}`}>
                                                                {notif.title}
                                                            </p>
                                                            <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap pt-0.5">
                                                                {notif.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                                            {notif.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Footer */}
                                {notifications.length > 0 && (
                                    <div className="p-2.5 bg-slate-50/50 border-t border-slate-100 text-center">
                                        <button
                                            onClick={clearAll}
                                            className="text-xs font-bold text-slate-500 hover:text-slate-600 transition"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-2 md:pl-4 md:border-l border-slate-200">
                    <div className="hidden md:block text-right">
                        <h2 className="font-bold text-sm text-slate-800 leading-tight">
                            User
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            {role || "User"}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex justify-center items-center font-bold shadow-sm border-2 border-white cursor-pointer hover:scale-105 transition">
                        A
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;