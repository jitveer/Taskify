import { useState } from "react";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import ReportsDashboard from "../../components/layout/ReportsDashboard";
import AdminDailyReportsSection from "../../components/layout/AdminDailyReportsSection";
import { BarChart3, FileText } from "lucide-react";

function AdminReports() {
    const [activeTab, setActiveTab] = useState("daily"); // "daily" or "analytics"

    const menuItems = [
        { name: "Dashboard", path: "/admin-dashboard" },
        { name: "Employee List", path: "/admin-employee-list" },
        { name: "Add Task", path: "/admin-assign-task" },
        { name: "My Tasks", path: "/admin-my-tasks" },
        { name: "Tasks Assigned by Me", path: "/admin-task-status" },
        { name: "Reports", path: "/admin-reports" }
    ];

    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Admin" menuItems={menuItems} color="blue" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full">
                {/* Header */}
                <Header title="Reports & Work Logs" role="Admin" />

                <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8 space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit border border-slate-200/60 shadow-2xs">
                        <button
                            onClick={() => setActiveTab("daily")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === "daily"
                                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/60"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <FileText size={15} />
                            <span>My Daily Reports</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === "analytics"
                                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/60"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <BarChart3 size={15} />
                            <span>Task Activity Log</span>
                        </button>
                    </div>

                    {/* Active View */}
                    {activeTab === "daily" ? (
                        <AdminDailyReportsSection color="blue" />
                    ) : (
                        <ReportsDashboard color="blue" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminReports;

