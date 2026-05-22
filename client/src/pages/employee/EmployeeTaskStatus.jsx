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
        <div className="flex flex-col md:flex-row bg-[#f8fafc] min-h-screen font-sans">

            <Sidebar
                role="Employee"
                menuItems={menuItems}
                color="emerald"
            />

            <div className="flex-1 min-h-screen">

                <Header title="Task Status" name="Employee" role="Employee" />

                <TaskStatusTable color="emerald" />

            </div>

        </div>

    );

}

export default EmployeeTaskStatus;
