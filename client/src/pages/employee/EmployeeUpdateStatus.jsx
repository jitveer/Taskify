import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

function EmployeeUpdateStatus() {

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

                <Header title="Update Status" />

                <div className="p-8">

                    <div className="bg-white rounded-2xl shadow-md p-6">

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Update Task Status
                        </h2>



                        <form className="space-y-5">

                            {/* Task Select */}
                            <div>

                                <label className="block text-gray-700 font-semibold mb-2">
                                    Select Task
                                </label>

                                <select className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500">

                                    <option>Complete Dashboard UI</option>

                                    <option>Fix Login Page</option>

                                    <option>API Integration</option>

                                </select>

                            </div>



                            {/* Status */}
                            <div>

                                <label className="block text-gray-700 font-semibold mb-2">
                                    Status
                                </label>

                                <select className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500">

                                    <option>Pending</option>

                                    <option>In Progress</option>

                                    <option>Completed</option>

                                </select>

                            </div>



                            {/* Comment */}
                            <div>

                                <label className="block text-gray-700 font-semibold mb-2">
                                    Comments
                                </label>

                                <textarea
                                    rows="4"
                                    placeholder="Enter progress update..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                                />

                            </div>



                            {/* Button */}
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold duration-300"
                            >
                                Update Status
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default EmployeeUpdateStatus;