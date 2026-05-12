import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";


function SuperAdminDashboard() {

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

            {/* Sidebar */}
            <Sidebar
                role="Super Admin"
                menuItems={menuItems}
                color="purple"
            />


            {/* Main Content */}
            <div className="flex-1 bg-gray-100 min-h-screen">

                {/* Header */}
                <Header title="Super Admin Dashboard" />



                {/* Dashboard Content */}
                <div className="p-8">

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">

                            <h2 className="text-gray-500 text-lg">
                                Total Employees
                            </h2>

                            <h1 className="text-4xl font-bold text-purple-600 mt-3">
                                120
                            </h1>

                        </div>



                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">

                            <h2 className="text-gray-500 text-lg">
                                Pending Tasks
                            </h2>

                            <h1 className="text-4xl font-bold text-orange-500 mt-3">
                                18
                            </h1>

                        </div>



                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">

                            <h2 className="text-gray-500 text-lg">
                                Completed Tasks
                            </h2>

                            <h1 className="text-4xl font-bold text-green-600 mt-3">
                                86
                            </h1>

                        </div>

                    </div>



                    {/* Recent Tasks */}
                    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

                        <h2 className="text-2xl font-bold text-gray-800 mb-5">
                            Recent Tasks
                        </h2>



                        <div className="space-y-4">

                            <div className="flex justify-between items-center border-b pb-3">

                                <div>
                                    <h3 className="font-semibold">
                                        Complete UI Design
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Assigned to John
                                    </p>
                                </div>

                                <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm">
                                    Pending
                                </span>

                            </div>



                            <div className="flex justify-between items-center border-b pb-3">

                                <div>
                                    <h3 className="font-semibold">
                                        Backend API Integration
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Assigned to Sarah
                                    </p>
                                </div>

                                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
                                    Completed
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    )
}

export default SuperAdminDashboard;