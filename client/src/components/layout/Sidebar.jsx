import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { showSuccess, showConfirm } from "../../components/layout/alerts";
import { Home, Users, CheckSquare, FileText, LayoutDashboard, Bell } from "lucide-react";
import { getNotifications } from "../../utils/notifications";

function Sidebar({ role, menuItems, color }) {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();


    useEffect(() => {
        const updateCount = async () => {
            try {
                const notifs = await getNotifications(); // Added async/await here
                if (Array.isArray(notifs)) {
                    setUnreadCount(notifs.filter(n => !n.read).length);
                } else {
                    setUnreadCount(0);
                }
            } catch (error) {
                console.error("Error sidebar unread count:", error);
                setUnreadCount(0);
            }
        };
        updateCount();
        window.addEventListener("notificationsUpdated", updateCount);
        return () => window.removeEventListener("notificationsUpdated", updateCount);
    }, []);



    const modifiedMenuItems = [...menuItems];
    const dashboardIndex = modifiedMenuItems.findIndex(item => item.name.toLowerCase().includes("dashboard"));
    const hasNotification = modifiedMenuItems.some(item => item.name.toLowerCase().includes("notification"));

    if (!hasNotification) {
        const notificationItem = { name: "Notification", path: "/notifications" };
        if (dashboardIndex !== -1) {
            modifiedMenuItems.splice(dashboardIndex + 1, 0, notificationItem);
        } else {
            modifiedMenuItems.splice(1, 0, notificationItem);
        }
    }

    {/*logout button sweet alert*/ }
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await showConfirm({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            icon: "warning",
            isDestructive: true
        });

        if (result.isConfirmed) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            await showSuccess("Logged Out Successfully");
            navigate("/");
        }
    };



    useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        window.addEventListener("toggleSidebar", handleToggle);
        return () => window.removeEventListener("toggleSidebar", handleToggle);
    }, []);

    const getIcon = (name, isActive) => {
        const n = name.toLowerCase();
        const strokeWidth = isActive ? 3 : 2;
        if (n.includes("dashboard")) return <LayoutDashboard size={20} strokeWidth={strokeWidth} />;
        if (n.includes("employee")) return <Users size={20} strokeWidth={strokeWidth} />;
        if (n.includes("task") || n.includes("status")) return <CheckSquare size={20} strokeWidth={strokeWidth} />;
        if (n.includes("report")) return <FileText size={20} strokeWidth={strokeWidth} />;
        if (n.includes("notification")) return <Bell size={20} strokeWidth={strokeWidth} />;
        return <Home size={20} strokeWidth={strokeWidth} />;
    };

    const renderSidebarContent = () => (
        <>
            {/* Logo */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold">
                    Taskify
                </h1>
                <p className="text-sm text-gray-200 mt-2">
                    {role} Panel
                </p>
            </div>

            {/* menu Items */}
            <div className="space-y-3">
                {modifiedMenuItems.map((item, index) => {
                    const isNotification = item.name === "Notification";
                    return (
                        <Link to={item.path} key={index} onClick={() => setIsOpen(false)}>
                            <div className="hover:bg-white/20 px-4 py-3 rounded-xl cursor-pointer duration-300 mb-2 flex items-center justify-between">
                                <span>{item.name}</span>
                                {isNotification && unreadCount > 0 && (
                                    <span className="bg-white text-slate-800 text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm shrink-0">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Logut */}
            <div className="mt-20">
                <button onClick={handleLogout}
                    className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 duration-300">
                    Logout
                </button>
            </div>
        </>
    );

    if (role === "Employee") {
        return (
            <>
                <div className={`hidden lg:block w-[280px] min-h-screen bg-${color}-600 text-white p-6`}>
                    {renderSidebarContent()}
                </div>

                {/* Mobile Bottom Nav */}
                <div className={`lg:hidden fixed bottom-0 left-0 w-full bg-${color}-600 text-white flex justify-between items-center px-6 py-3 pb-safe z-50 rounded-t-2xl shadow-[0_-4px_15px_rgba(0,0,0,0.15)]`}>
                    {modifiedMenuItems
                        .filter(item => item.name.toLowerCase() !== "my profile") // <--- "My Profile" ko filter kiya
                        .map((item, index) => {
                            // Shorten names for bottom nav
                            let shortName = item.name.replace('Employee ', '').replace(' Status', '');
                            if (item.name === "Notification") shortName = "Notify";
                            if (shortName.length > 10) shortName = shortName.substring(0, 10);

                            const isNotification = item.name === "Notification";
                            const isActive = location.pathname === item.path;

                            return (
                                <Link to={item.path} key={index} className={`flex flex-col items-center gap-1.5 transition-all flex-1 relative ${isActive ? "opacity-100 text-white font-bold" : "opacity-60 hover:opacity-100"}`}>
                                    <div className="relative">
                                        {getIcon(item.name, isActive)}
                                        {isNotification && unreadCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold min-w-[14px] h-[14px] flex items-center justify-center rounded-full px-0.5">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] tracking-tight truncate w-full text-center ${isActive ? "font-bold" : "font-medium"}`}>{shortName}</span>
                                </Link>
                            );
                        })}
                </div>


            </>
        );
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`fixed lg:relative top-0 left-0 z-50 w-[280px] min-h-screen bg-${color}-600 text-white p-6 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

                {/* Close Button for mobile */}
                <button
                    className="lg:hidden absolute top-6 right-6 text-white hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                >
                    ✕
                </button>

                {renderSidebarContent()}
            </div>
        </>
    );
}

export default Sidebar;