import { Menu, Bell } from "lucide-react";

function Header({ title, role }) {
    const showHamburger = role === "Admin" || role === "Super Admin";

    return (

        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-40">

            {/* Left Side */}
            <div className="flex items-center gap-3">
                
                {/* Hamburger menu for Admin/SuperAdmin on mobile/tablet */}
                {showHamburger && (
                    <button 
                        className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                        onClick={() => window.dispatchEvent(new Event("toggleSidebar"))}
                    >
                        <Menu size={20} />
                    </button>
                )}

                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight whitespace-nowrap">
                        {title}
                    </h1>
                </div>

            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 md:gap-4">

                {/* Notification */}
                <button className="relative p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 transition border border-slate-100">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-2 md:pl-4 md:border-l border-slate-200">
                    <div className="hidden md:block text-right">
                        <h2 className="font-bold text-sm text-slate-800 leading-tight">
                            User
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            {role || "User"}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex justify-center items-center font-bold shadow-sm border-2 border-white cursor-pointer hover:scale-105 transition">
                        A
                    </div>
                </div>

            </div>

        </div>

    )
}

export default Header;