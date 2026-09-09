import { useState } from "react";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import ReportsDashboard from "../../components/layout/ReportsDashboard";
import SuperAdminDailyReportsView from "../../components/layout/SuperAdminDailyReportsView";
import { BarChart3, FileText } from "lucide-react";

function Reports() {
    const [activeTab, setActiveTab] = useState("adminReports"); // "adminReports" or "taskAnalytics"

    const menuItems = [
        { name: "Dashboard", path: "/super-admin-dashboard" },
        { name: "Admin List", path: "/admin-list" },
        { name: "Employee List", path: "/employee-list" },
        { name: "Add Task", path: "/assign-task" },
        // { name: "Task List", path: "/my-tasks" },
        { name: "Tasks Assigned by Me", path: "/task-status" },
        { name: "Reports", path: "/reports" }
    ];

    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Super Admin" menuItems={menuItems} color="purple" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full">
                {/* Header */}
                <Header title="Master Reports & Logs" name="Super Admin" role="Super Admin" />

                <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8 space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-fit border border-slate-200/60 shadow-2xs">
                        <button
                            onClick={() => setActiveTab("adminReports")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === "adminReports"
                                    ? "bg-white text-purple-700 shadow-sm border border-slate-200/60"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <FileText size={15} />
                            <span>Admin Daily Reports</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("taskAnalytics")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                activeTab === "taskAnalytics"
                                    ? "bg-white text-purple-700 shadow-sm border border-slate-200/60"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <BarChart3 size={15} />
                            <span>Task Activity Log</span>
                        </button>
                    </div>

                    {/* Active View */}
                    {activeTab === "adminReports" ? (
                        <SuperAdminDailyReportsView color="purple" />
                    ) : (
                        <ReportsDashboard color="purple" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reports;

