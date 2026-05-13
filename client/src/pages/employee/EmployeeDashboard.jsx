import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

function EmployeeDashboard() {
    
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

            {/* Sidebar */}
            <Sidebar
                role="Employee"
                menuItems={menuItems}
                color="green"
            />



            {/* Main Content */}
            <div className="flex-1 bg-gray-100 min-h-screen">

                {/* Header */}
                <Header
                    title="Employee Dashboard"
                    name="Employee"
                    role="Employee"
                />



                {/* Dashboard Content */}
                <div className="p-8">

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">

                            <h2 className="text-gray-500 text-lg">
                                My Tasks
                            </h2>

                            <h1 className="text-4xl font-bold text-green-600 mt-3">
                                12
                            </h1>

                        </div>



                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">

                            <h2 className="text-gray-500 text-lg">
                                Pending Tasks
                            </h2>

                            <h1 className="text-4xl font-bold text-orange-500 mt-3">
                                4
                            </h1>

                        </div>



                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-2xl shadow-md">

                            <h2 className="text-gray-500 text-lg">
                                Completed Tasks
                            </h2>

                            <h1 className="text-4xl font-bold text-blue-600 mt-3">
                                8
                            </h1>

                        </div>

                    </div>



                    {/* Recent Tasks */}
                    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

                        <h2 className="text-2xl font-bold text-gray-800 mb-5">
                            My Recent Tasks
                        </h2>



                        <div className="space-y-4">

                            {/* Task 1 */}
                            <div className="flex justify-between items-center border-b pb-3">

                                <div>

                                    <h3 className="font-semibold">
                                        Complete React Dashboard
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Deadline: Tomorrow
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
                                        Update Employee Profile
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Deadline: Friday
                                    </p>

                                </div>



                                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
                                    In Progress
                                </span>

                            </div>



                            {/* Task 3 */}
                            <div className="flex justify-between items-center">

                                <div>

                                    <h3 className="font-semibold">
                                        Submit Weekly Report
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Deadline: Monday
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

export default EmployeeDashboard;