import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import AssignTaskForm from "../../components/layout/AssignTaskForm";

function AssignTask() {

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
            <div className="flex-1 min-h-screen w-full overflow-hidden">
                {/* Header */}
                <Header title="Assign Master Task" name="Super Admin" role="Super Admin" />

                {/* Super Admin Assign Task Form */}
                <div className="lg:pt-4">
                    <AssignTaskForm color="purple" apiPrefix="/api/superadmin"/>
                </div>
            </div>
        </div>
    );
}

export default AssignTask;
