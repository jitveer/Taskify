import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import TaskStatusTable from "../../components/layout/TaskStatusTable";

function TaskStatus() {

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

        <div className="flex">

            <Sidebar
                role="Super Admin"
                menuItems={menuItems}
                color="purple"
            />



            <div className="flex-1 bg-gray-100 min-h-screen">

                <Header title="Task Status" />

                <TaskStatusTable color="purple" />

            </div>

        </div>

    );

}

export default TaskStatus;