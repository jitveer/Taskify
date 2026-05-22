import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import MyTaskTable from "../../components/layout/MyTaskTable";

function MyTasks() {

    const menuItems = [
        { name: "Dashboard", path: "/super-admin-dashboard" },
        { name: "Admin List", path: "/admin-list" },
        { name: "Employee List", path: "/employee-list" },
        { name: "Assign Task", path: "/assign-task" },
        { name: "My Tasks", path: "/my-tasks" },
        { name: "Task Status", path: "/task-status" },
        { name: "Reports", path: "/reports" }
    ];

    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Super Admin" menuItems={menuItems} color="purple" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full overflow-hidden">
                {/* Header */}
                <Header title="My Master Tasks" name="Super Admin" role="Super Admin" />

                <MyTaskTable color="purple" />
            </div>
        </div>
    );
}

export default MyTasks;
