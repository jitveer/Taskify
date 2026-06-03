import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Home, Users, CheckSquare, FileText, LayoutDashboard } from "lucide-react";

function Sidebar({ role, menuItems, color }) {
    const [isOpen, setIsOpen] = useState(false);


    {/*logout button sweet alert*/ }
    const navigate = useNavigate();

    const handleLogout = () => {

        Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel"
        }).then((result) => {

            if (result.isConfirmed) {

                localStorage.removeItem("user");
                localStorage.removeItem("token");

                Swal.fire({
                    icon: "success",
                    title: "Logged Out Successfully",
                    timer: 1500,
                    showConfirmButton: false
                });

                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
        });
    };



    useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        window.addEventListener("toggleSidebar", handleToggle);
        return () => window.removeEventListener("toggleSidebar", handleToggle);
    }, []);

    const getIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes("dashboard")) return <LayoutDashboard size={20} />;
        if (n.includes("employee")) return <Users size={20} />;
        if (n.includes("task") || n.includes("status")) return <CheckSquare size={20} />;
        if (n.includes("report")) return <FileText size={20} />;
        return <Home size={20} />;
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
                {menuItems.map((item, index) => (
                    <Link to={item.path} key={index} onClick={() => setIsOpen(false)}>
                        <div className="hover:bg-white/20 px-4 py-3 rounded-xl cursor-pointer duration-300 mb-2">
                            {item.name}
                        </div>
                    </Link>
                ))}
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
                    {menuItems.map((item, index) => {
                        // Shorten names for bottom nav
                        let shortName = item.name.replace('Employee ', '').replace(' Status', '');
                        if (shortName.length > 10) shortName = shortName.substring(0, 10);

                        return (
                            <Link to={item.path} key={index} className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity flex-1">
                                {getIcon(item.name)}
                                <span className="text-[10px] font-medium tracking-tight truncate w-full text-center">{shortName}</span>
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