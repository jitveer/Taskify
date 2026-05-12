function EmployeeTable({ color }) {

    const employees = [

        {
            id: "EMP101",
            name: "John Doe",
            email: "john@gmail.com",
            phone: "9876543210",
            department: "UI/UX",
            status: "Active"
        },

        {
            id: "EMP102",
            name: "Sarah Smith",
            email: "sarah@gmail.com",
            phone: "9876541230",
            department: "Frontend",
            status: "Active"
        },

        {
            id: "EMP103",
            name: "David Miller",
            email: "david@gmail.com",
            phone: "9876509876",
            department: "Backend",
            status: "Inactive"
        }

    ];

    const focusRing = color === "blue" ? "focus:ring-blue-500" : "focus:ring-purple-500";
    const btnBg = color === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700";
    const theadBg = color === "blue" ? "bg-blue-600" : "bg-purple-600";

    return (

        <div className="p-8">

            {/* Top Section */}
            <div className="flex justify-between items-center mb-6">

                <input
                    type="text"
                    placeholder="Search Employee..."
                    className={`w-[320px] border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 ${focusRing}`}
                />



                <button className={`${btnBg} text-white px-6 py-3 rounded-xl font-semibold duration-300 shadow-lg`}>

                    + Add Employee

                </button>

            </div>



            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">

                <table className="w-full">

                    <thead className={`${theadBg} text-white`}>

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
                                Phone
                            </th>

                            <th className="py-4 px-6 text-left">
                                Department
                            </th>

                            <th className="py-4 px-6 text-center">
                                Status
                            </th>

                            <th className="py-4 px-6 text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>



                    <tbody>

                        {
                            employees.map((employee, index) => (

                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50 duration-200"
                                >

                                    <td className="py-4 px-6">
                                        {index + 1}
                                    </td>

                                    <td className="py-4 px-6">
                                        {employee.id}
                                    </td>

                                    <td className="py-4 px-6 font-medium">
                                        {employee.name}
                                    </td>

                                    <td className="py-4 px-6">
                                        {employee.email}
                                    </td>

                                    <td className="py-4 px-6">
                                        {employee.phone}
                                    </td>

                                    <td className="py-4 px-6">
                                        {employee.department}
                                    </td>

                                    <td className="py-4 px-6 text-center">

                                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${employee.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}>

                                            {employee.status}

                                        </span>

                                    </td>



                                    <td className="py-4 px-6">

                                        <div className="flex justify-center gap-3">

                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm duration-300">

                                                Edit

                                            </button>



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

    );

}

export default EmployeeTable;