import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import AssignTaskForm from "../../components/layout/AssignTaskForm";

function AssignTask() {

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

                <Header title="Assign Task" />

                {/* Super Admin Assign Task Form */}
                <AssignTaskForm color="purple" />

            </div>

        </div>

    );

}

export default AssignTask;