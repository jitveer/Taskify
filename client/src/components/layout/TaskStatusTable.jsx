function TaskStatusTable({ color }) {

    const statuses = [

        {
            employee: "Rahul",
            task: "UI Design",
            progress: "25%",
            status: "Pending"
        },

        {
            employee: "Priya",
            task: "Backend API",
            progress: "70%",
            status: "In Progress"
        },

        {
            employee: "Karan",
            task: "Testing",
            progress: "100%",
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
                                Employee
                            </th>

                            <th className="py-4 px-6 text-left">
                                Task
                            </th>

                            <th className="py-4 px-6 text-left">
                                Progress
                            </th>

                            <th className="py-4 px-6 text-center">
                                Status
                            </th>

                        </tr>

                    </thead>



                    <tbody>

                        {
                            statuses.map((item, index) => (

                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="py-4 px-6">
                                        {item.employee}
                                    </td>

                                    <td className="py-4 px-6">
                                        {item.task}
                                    </td>

                                    <td className="py-4 px-6">
                                        {item.progress}
                                    </td>



                                    <td className="py-4 px-6 text-center">

                                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${item.status === "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : item.status === "In Progress"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>

                                            {item.status}

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

export default TaskStatusTable;