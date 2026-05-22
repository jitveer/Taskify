import { Link } from "react-router-dom";
import { ShieldAlert, ShieldCheck, UserCircle, ArrowRight } from "lucide-react";

function Home() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 md:px-8 py-12 font-sans relative overflow-hidden">
            
            {/* Subtle Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
            <div className="absolute top-[20%] left-[50%] w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>

            <div className="z-10 w-full max-w-6xl">
                
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                        <span className="text-slate-600 font-bold tracking-wider text-sm uppercase">
                            Welcome to Taskify
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight">
                        Smart Task Management
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
                        A seamless, intelligent ecosystem for your entire organization. Select your portal to continue.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                    
                    {/* Super Admin - Purple */}
                    <div className="group bg-white rounded-3xl p-8 text-center shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300 border border-slate-100 hover:border-purple-100 flex flex-col items-center hover:-translate-y-1">
                        <div className="w-20 h-20 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition duration-300">
                            <ShieldAlert size={36} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Super Admin</h2>
                        <p className="text-slate-500 text-sm mb-8 flex-grow leading-relaxed">
                            Complete oversight. Manage global settings and entire organizations.
                        </p>
                        <Link to="/super-admin-login" className="w-full">
                            <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl font-semibold transition duration-300 shadow-md shadow-purple-200">
                                Access Portal <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>

                    {/* Admin - Blue */}
                    <div className="group bg-white rounded-3xl p-8 text-center shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 border border-slate-100 hover:border-blue-100 flex flex-col items-center hover:-translate-y-1">
                        <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition duration-300">
                            <ShieldCheck size={36} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Admin</h2>
                        <p className="text-slate-500 text-sm mb-8 flex-grow leading-relaxed">
                            Team leadership. Manage employees, projects, and task approvals.
                        </p>
                        <Link to="/admin-login" className="w-full">
                            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition duration-300 shadow-md shadow-blue-200">
                                Access Portal <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>

                    {/* Employee - Green */}
                    <div className="group bg-white rounded-3xl p-8 text-center shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300 border border-slate-100 hover:border-green-100 flex flex-col items-center hover:-translate-y-1">
                        <div className="w-20 h-20 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition duration-300">
                            <UserCircle size={36} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Employee</h2>
                        <p className="text-slate-500 text-sm mb-8 flex-grow leading-relaxed">
                            Your workspace. Track tasks, view reports, and manage status.
                        </p>
                        <Link to="/employee-login" className="w-full">
                            <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-semibold transition duration-300 shadow-md shadow-green-200">
                                Access Portal <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Home;
