import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import EmployeeTable from "../../components/layout/EmployeeTable";

function AdminEmployeeList() {

    const menuItems = [
        { name: "Dashboard", path: "/admin-dashboard" },
        { name: "Employee List", path: "/admin-employee-list" },
        { name: "Assign Task", path: "/admin-assign-task" },
        { name: "My Tasks", path: "/admin-my-tasks" },
        { name: "Task Status", path: "/admin-task-status" },
        { name: "Reports", path: "/admin-reports" }
    ];

    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Admin" menuItems={menuItems} color="blue" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full overflow-hidden">
                {/* Header */}
                <Header title="Employee Directory" role="Admin" />

                {/* Admin Employee Table */}
                <EmployeeTable color="blue" />
            </div>
        </div>
    );
}

export default AdminEmployeeList;
// fasldfja;f