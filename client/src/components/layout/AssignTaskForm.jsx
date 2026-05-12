function AssignTaskForm({ color }) {

    const inputStyle = `w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 ${
        color === "blue"
            ? "focus:ring-blue-500"
            : "focus:ring-purple-500"
    }`;



    const buttonStyle = `${
        color === "blue"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-purple-600 hover:bg-purple-700"
    } text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg duration-300`;



    return (

        <div className="p-8">

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-5xl mx-auto">

                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                    Create new Task
                </h2>



                {/* Task Type */}
                <div className="mb-6">

                    <label className="block text-gray-700 font-semibold mb-3">

                        Task Type

                    </label>



                    <div className="flex items-center gap-6">

                        <label className="flex items-center gap-2">

                            <input
                                type="radio"
                                name="tasktype"
                                className="w-5 h-5"
                            />

                            Individual

                        </label>



                        <label className="flex items-center gap-2">

                            <input
                                type="radio"
                                name="tasktype"
                                className="w-5 h-5"
                            />

                            Group Task

                        </label>

                    </div>

                </div>



                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Employee ID */}
                    <div>

                        <label className="block text-gray-700 font-semibold mb-2">

                            Employee ID

                        </label>

                        <select className={inputStyle}>

                            <option>Select Employee ID</option>

                            <option>EMP001</option>
                            <option>EMP002</option>
                            <option>EMP003</option>

                        </select>

                    </div>



                    {/* Employee Name */}
                    <div>

                        <label className="block text-gray-700 font-semibold mb-2">

                            Employee Name

                        </label>

                        <select className={inputStyle}>

                            <option>Select Employee</option>

                            <option>John Doe</option>
                            <option>Sarah Smith</option>
                            <option>David Miller</option>

                        </select>

                    </div>



                    {/* Department */}
                    <div>

                        <label className="block text-gray-700 font-semibold mb-2">

                            Department

                        </label>

                        <select className={inputStyle}>

                            <option>Select Department</option>

                            <option>Frontend</option>
                            <option>Backend</option>
                            <option>UI/UX</option>

                        </select>

                    </div>



                    {/* Priority */}
                    <div>

                        <label className="block text-gray-700 font-semibold mb-2">

                            Priority

                        </label>

                        <select className={inputStyle}>

                            <option>Select Priority</option>

                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>

                        </select>

                    </div>

                </div>



                {/* Task Title */}
                <div className="mt-6">

                    <label className="block text-gray-700 font-semibold mb-2">

                        Task Title

                    </label>

                    <input
                        type="text"
                        placeholder="Enter task title"
                        className={inputStyle}
                    />

                </div>



                {/* Description */}
                <div className="mt-6">

                    <label className="block text-gray-700 font-semibold mb-2">

                        Task Description

                    </label>

                    <textarea
                        rows="5"
                        placeholder="Enter task description..."
                        className={inputStyle}
                    ></textarea>

                </div>



                {/* Due Date */}
                <div className="mt-6">

                    <label className="block text-gray-700 font-semibold mb-2">

                        Due Date

                    </label>

                    <input
                        type="date"
                        className={inputStyle}
                    />

                </div>



                {/* Attachment */}
                <div className="mt-6">

                    <label className="block text-gray-700 font-semibold mb-2">

                        Attachments

                    </label>

                    <input
                        type="file"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
                    />

                </div>



                {/* Button */}
                <div className="mt-8">

                    <button className={buttonStyle}>

                        Assign Task

                    </button>

                </div>

            </div>

        </div>

    );

}

export default AssignTaskForm;