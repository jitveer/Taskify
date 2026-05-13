import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

function AdminList() {

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




    const admins = [

        {
            id: "EMP001",
            name: "John Doe",
            email: "john@gmail.com",
            phone: "9876543210"
        },

        {
            id: "EMP002",
            name: "Sarah Smith",
            email: "sarah@gmail.com",
            phone: "9876541230"
        },

        {
            id: "EMP003",
            name: "David Miller",
            email: "david@gmail.com",
            phone: "9876509876"
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
                <Header title="Admin List" />



                <div className="p-8">

                    {/* Top Section */}
                    <div className="flex justify-between items-center mb-6">

                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search Admin..."
                            className="w-[300px] border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                        />



                        {/* Add Admin Button */}
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold duration-300 shadow-lg">

                            + Add Admin

                        </button>

                    </div>



                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

                        <table className="w-full">

                            {/* Table Header */}
                            <thead className="bg-purple-600 text-white">

                                <tr>

                                    <th className="py-4 px-6 text-left">
                                        Sl.No
                                    </th>

                                    <th className="py-4 px-6 text-left">
                                        Employee ID
                                    </th>

                                    <th className="py-4 px-6 text-left">
                                        Name
                                    </th>

                                    <th className="py-4 px-6 text-left">
                                        Email
                                    </th>

                                    <th className="py-4 px-6 text-left">
                                        Phone Number
                                    </th>

                                    <th className="py-4 px-6 text-center">
                                        Actions
                                    </th>

                                </tr>

                            </thead>



                            {/* Table Body */}
                            <tbody>

                                {
                                    admins.map((admin, index) => (

                                        <tr
                                            key={index}
                                            className="border-b hover:bg-gray-50 duration-200"
                                        >

                                            <td className="py-4 px-6">
                                                {index + 1}
                                            </td>

                                            <td className="py-4 px-6">
                                                {admin.id}
                                            </td>

                                            <td className="py-4 px-6 font-medium">
                                                {admin.name}
                                            </td>

                                            <td className="py-4 px-6">
                                                {admin.email}
                                            </td>

                                            <td className="py-4 px-6">
                                                {admin.phone}
                                            </td>



                                            {/* Actions */}
                                            <td className="py-4 px-6">

                                                <div className="flex justify-center gap-3">

                                                    {/* Edit */}
                                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm duration-300">

                                                        Edit

                                                    </button>



                                                    {/* Delete */}
                                                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm duration-300">

                                                        Delete

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminList;