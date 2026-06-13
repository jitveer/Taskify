import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import ReportsDashboard from "../../components/layout/ReportsDashboard"

function AdminReports() {

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
            <div className="flex-1 min-h-screen w-full overflow-hidden">
                {/* Header */}
                <Header title="Analytics Reports" role="Admin" />

                <ReportsDashboard color="blue" />
            </div>
        </div>
    );
}

export default AdminReports;
