import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

function AdminDashboard() {

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
            path: "/admin-assign-task"
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
                <Header title="Admin Dashboard" />


                {/* Dashboard Content */}
                <div className="p-8">

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">

                            <h2 className="text-gray-500 text-lg">
                                Total Employees
                            </h2>

                            <h1 className="text-4xl font-bold text-blue-600 mt-3">
                                85
                            </h1>

                        </div>



                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">

                            <h2 className="text-gray-500 text-lg">
                                Pending Tasks
                            </h2>

                            <h1 className="text-4xl font-bold text-orange-500 mt-3">
                                14
                            </h1>

                        </div>



                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">

                            <h2 className="text-gray-500 text-lg">
                                Completed Tasks
                            </h2>

                            <h1 className="text-4xl font-bold text-green-600 mt-3">
                                62
                            </h1>

                        </div>

                    </div>



                    {/* Recent Tasks */}
                    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

                        <h2 className="text-2xl font-bold text-gray-800 mb-5">
                            Recent Tasks
                        </h2>



                        <div className="space-y-4">

                            {/* Task 1 */}
                            <div className="flex justify-between items-center border-b pb-3">

                                <div>

                                    <h3 className="font-semibold">
                                        Create Employee Dashboard
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Assigned to Rahul
                                    </p>

                                </div>



                                <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm">

                                    Pending

                                </span>

                            </div>



                            {/* Task 2 */}
                            <div className="flex justify-between items-center border-b pb-3">

                                <div>

                                    <h3 className="font-semibold">
                                        Attendance API Integration
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Assigned to Priya
                                    </p>

                                </div>



                                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">

                                    Completed

                                </span>

                            </div>



                            {/* Task 3 */}
                            <div className="flex justify-between items-center">

                                <div>

                                    <h3 className="font-semibold">
                                        Fix Login Validation
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Assigned to Karan
                                    </p>

                                </div>



                                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">

                                    In Progress

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    )
}

export default AdminDashboard;