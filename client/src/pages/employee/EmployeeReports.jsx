import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import ReportsDashboard from "../../components/layout/ReportsDashboard";

function EmployeeReports() {

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
            name: "Reports",
            path: "/employee-reports"
        },
        {
            name: "My Profile",
            path: "/employee-profile"
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

                <Header title="Reports" name="Employee" role="Employee" />

                <ReportsDashboard color="emerald" />

            </div>

        </div>

    );

}

export default EmployeeReports;
