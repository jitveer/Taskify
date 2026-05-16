function MyTaskTable({ color }) {

    const tasks = [

        {
            title: "UI Dashboard Design",
            priority: "High",
            dueDate: "20 May 2026",
            status: "Pending"
        },

        {
            title: "Backend API Integration",
            priority: "Medium",
            dueDate: "22 May 2026",
            status: "In Progress"
        },

        {
            title: "Attendance Module",
            priority: "Low",
            dueDate: "25 May 2026",
            status: "Completed"
        }

    ];



    return (

        <div className="p-8">

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">

                <table className="w-full">

                    <thead className={`${color === "blue"
                            ? "bg-blue-600"

                            : color === "green"
                                ? "bg-green-600"

                                : "bg-purple-600"

                        } text-white`}>

                        <tr>

                            <th className="py-4 px-6 text-left">
                                Sl.No
                            </th>

                            <th className="py-4 px-6 text-left">
                                Task Title
                            </th>

                            <th className="py-4 px-6 text-left">
                                Priority
                            </th>

                            <th className="py-4 px-6 text-left">
                                Due Date
                            </th>

                            <th className="py-4 px-6 text-center">
                                Status
                            </th>

                        </tr>

                    </thead>



                    <tbody>

                        {
                            tasks.map((task, index) => (

                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="py-4 px-6">
                                        {index + 1}
                                    </td>

                                    <td className="py-4 px-6">
                                        {task.title}
                                    </td>

                                    <td className="py-4 px-6">
                                        {task.priority}
                                    </td>

                                    <td className="py-4 px-6">
                                        {task.dueDate}
                                    </td>



                                    <td className="py-4 px-6 text-center">

                                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${task.status === "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : task.status === "In Progress"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>

                                            {task.status}

                                        </span>

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

export default MyTaskTable;