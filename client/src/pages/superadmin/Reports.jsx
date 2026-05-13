import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import ReportsDashboard from "../../components/layout/ReportsDashboard";

function Reports() {

    const menuItems = [

        {
            name: "Dashboard",
            path: "/super-admin-dashboard"
        },

        {
            name: "Admin List",
            path: "/admin-list"
        },

        {
            name: "Employee List",
            path: "/employee-list"
        },

        {
            name: "Assign Task",
            path: "/assign-task"
        },

        {
            name: "My Tasks",
            path: "/my-tasks"
        },

        {
            name: "Task Status",
            path: "/task-status"
        },

        {
            name: "Reports",
            path: "/reports"
        }


    ];




    return (

        <div className="flex">

            <Sidebar
                role="Super Admin"
                menuItems={menuItems}
                color="purple"
            />



            <div className="flex-1 bg-gray-100 min-h-screen">

                <Header title="Reports" />

                <ReportsDashboard color="purple" />

            </div>

        </div>

    );

}

export default Reports;