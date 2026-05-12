import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import AssignTaskForm from "../../components/layout/AssignTaskForm";

function AdminAssignTask() {

    const menuItems = [

        {
            name: "Dashboard",
            path: "/admin-dashboard"
        },

        {
            name: "Employee List",
            path: "/admin-employee-list"
        },

        {
            name: "Assign Task",
            path: "/admin-assign-task"
        },

        {
            name: "My Tasks",
            path: "/admin-my-tasks"
        },

        {
            name: "Task Status",
            path: "/admin-task-status"
        },

        {
            name: "Reports",
            path: "/admin-reports"
        }

    ];



    return (

        <div className="flex">

            {/* Sidebar */}
            <Sidebar
                role="Admin"
                menuItems={menuItems}
                color="blue"
            />



            {/* Main Content */}
            <div className="flex-1 bg-gray-100 min-h-screen">

                {/* Header */}
                <Header title="Assign Task" />



                {/* Reusable Form */}
                <AssignTaskForm color="blue" />

            </div>

        </div>

    );

}

export default AdminAssignTask;