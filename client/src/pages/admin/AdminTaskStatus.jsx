import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import TaskStatusTable from "../../components/layout/TaskStatusTable";

function AdminTaskStatus() {

    const menuItems = [

        {
            name: "Dashboard",
            path: "/admin-dashboard"
        },

        {
            name: "Employee List",
            path: "/admin-employeee-list"
        },

        {
            name: "Assign Task",
            path: "/admin-assign-task"
        },

        {
            name: "My Task",
            path: "/admin-my-tasks"
        },

        {
            name: "Task Status",
            path: "/admin-tast-status"
        },

        {
            name: "Reports",
            path: "/admin-reports"
        }
    ];


    return (

        <div className="flex">

            <Sidebar
                role="Admin"
                menuItems={menuItems}
                color="blue"
            />

            <div className="flex-1 bg-gray-100 min-h-screen">

                <Header title="Task Status" />

                <TaskStatusTable color="blue" />
            </div>
        </div>
    );
}


export default AdminTaskStatus;