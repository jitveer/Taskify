import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import TaskStatusTable from "../../components/layout/TaskStatusTable";

function EmployeeTaskStatus() {

    const menuItems = [

        {
            name: "Dashboard",
            path: "/employee-dashboard"
        },


        {
            name: "My Tasks",
            path: "/employee-my-tasks"
        },

        {
            name: "Task Status",
            path: "/employee-task-status"
        },

        {
            name: "Update Status",
            path: "/employee-update-status"
        },

        {
            name: "Reports",
            path: "/employee-reports"
        }

    ];


    return (

        <div className="flex">

            <Sidebar
                role="Employee"
                menuItems={menuItems}
                color="green"
            />



            <div className="flex-1 bg-gray-100 min-h-screen">

                <Header title="Task Status" />

                <TaskStatusTable color="green" />

            </div>

        </div>

    );

}

export default EmployeeTaskStatus;