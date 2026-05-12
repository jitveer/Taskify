function ReportsDashboard({ color }) {

    const cardColor =
        color === "blue"
            ? "text-blue-600"
            : "text-purple-600";



    return (

        <div className="p-8">

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow-md">

                    <h2 className="text-gray-500 text-lg">
                        Total Tasks
                    </h2>

                    <h1 className={`text-4xl font-bold mt-3 ${cardColor}`}>
                        145
                    </h1>

                </div>



                <div className="bg-white p-6 rounded-2xl shadow-md">

                    <h2 className="text-gray-500 text-lg">
                        Completed
                    </h2>

                    <h1 className="text-4xl font-bold text-green-600 mt-3">
                        96
                    </h1>

                </div>



                <div className="bg-white p-6 rounded-2xl shadow-md">

                    <h2 className="text-gray-500 text-lg">
                        Pending
                    </h2>

                    <h1 className="text-4xl font-bold text-yellow-500 mt-3">
                        31
                    </h1>

                </div>



                <div className="bg-white p-6 rounded-2xl shadow-md">

                    <h2 className="text-gray-500 text-lg">
                        In Progress
                    </h2>

                    <h1 className="text-4xl font-bold text-blue-500 mt-3">
                        18
                    </h1>

                </div>

            </div>

        </div>

    );

}

export default ReportsDashboard;