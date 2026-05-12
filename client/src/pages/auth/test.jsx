import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import ReportsDashboard from "../../components/layout/ReportsDashboard";

function AdminReports() {

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

            <Sidebar
                role="Admin"
                menuItems={menuItems}
                color="blue"
            />



            <div className="flex-1 bg-gray-100 min-h-screen">

                <Header title="Reports" />

                <ReportsDashboard color="blue" />

            </div>

        </div>

    );

}

export default AdminReports;