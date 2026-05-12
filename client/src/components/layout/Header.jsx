function Header({ title }) {

    return (

        <div className="bg-white shadow-md px-8 py-5 flex justify-between items-center">

            {/* Left Side */}
            <div>

                <h1 className="text-3xl font-bold text-gray-800">
                    {title}
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Welcome back to Taskify
                </p>

            </div>



            {/* Right Side */}
            <div className="flex items-center gap-4">

                {/* Notification */}
                <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl duration-300">
                    🔔
                </button>



                {/* Profile */}
                <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl">

                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex justify-center items-center font-bold">

                        A

                    </div>

                    <div>

                        <h2 className="font-semibold text-gray-800">
                            Admin
                        </h2>

                        <p className="text-sm text-gray-500">
                            Super Admin
                        </p>

                    </div>

                </div>

            </div>

        </div>

    )
}

export default Header;