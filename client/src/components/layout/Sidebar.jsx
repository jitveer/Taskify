import { Link } from "react-router-dom";

function Sidebar({ role, menuItems, color }) {
    return (
        <div className={`w-[280px] min-h-screen bg-${color}-600 text-white p-6`}>

            {/* Logo */}
            <div className="mb-10">

                <h1 className="text-3xl font-bold">
                    Taskify
                </h1>

                <p className="text-sm text-gray-200 mt-2">
                    {role} Panel
                </p>

            </div>


            {/* menu Items */}
            <div className="space-y-3">


                {
                    menuItems.map((item, index) => (

                        <Link
                            to={item.path}
                            key={index}
                        >

                            <div className="hover:bg-white/20 px-4 py-3 rounded-xl cursor-pointer duration-300 mb-2">

                                {item.name}

                            </div>

                        </Link>

                    ))
                }
            </div>


            {/* Bottom Logut */}
            <div className="mt-20">

                <button className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 duration-300">
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Sidebar;