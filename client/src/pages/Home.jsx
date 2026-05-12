import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex justify-center items-center px-5">

            {/* main card */}
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-10">

                {/* Heading */}
                <div className="text-center mb-12">

                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        Welcome to Taskify
                    </h1>

                    <p className="text-gray-600 text-lg">
                        Smart Task and Employee Management System
                    </p>
                </div>


                <div className="grid md:grid-cols-3 gap-8">

                    {/*Super Admin */}
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl p-8 text-center shadow-lg hover:scale-105 duration-300 cursor-pointer">

                        <h2 className="text-2xl font-bold mb-4">
                            Super Admin</h2>

                        <p className="mb-6 text-sm">Manage the entire organization and system settings.</p>

                        <Link to="/super-admin-login">
                            <button className="bg-white text-indigo-700 px-8 py-2 rounded-xl font-semibold hover:bg-gray-200 duration-300">
                                Login
                            </button>
                        </Link>

                    </div>


                    {/* Admin */}
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-8 text-center shadow-lg hover:scale-105 duration-300 cursor-pointer">

                        <h2 className="text-2xl font-bold mb-4">
                            Admin
                        </h2>

                        <p className="mb-6 text-sm">
                            Manage employees, projects and approvals.
                        </p>

                        <Link to="/admin-login">
                            <button className="bg-white text-blue-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 duration-300">
                                Login
                            </button>
                        </Link>

                    </div>


                    {/* Employee */}
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-8 text-center shadow-lg hover:scale-105 duration-300 cursor-pointer">

                        <h2 className="text-2xl font-bold mb-4">
                            Employee
                        </h2>

                        <p className="mb-6 text-sm">
                            Access Employee tools and tasks.
                        </p>


                        <Link to="/employee-login">
                            <button className="bg-white text-green-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 duration-300">
                                Login
                            </button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Home;