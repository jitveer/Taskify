import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { Send, CheckCircle2 } from "lucide-react";

function EmployeeUpdateStatus() {
    const menuItems = [
        { name: "Dashboard", path: "/employee-dashboard" },
        { name: "My Tasks", path: "/employee-my-tasks" },
        { name: "Task Status", path: "/employee-task-status" },
        { name: "Update Status", path: "/employee-update-status" },
        { name: "Reports", path: "/employee-reports" }
    ];

    return (
        <div className="flex flex-col md:flex-row bg-[#f8fafc] min-h-screen font-sans">
            <Sidebar role="Employee" menuItems={menuItems} color="emerald" />

            <div className="flex-1 min-h-screen">
                <Header title="Update Status" name="Employee" role="Employee" />

                <div className="p-4 md:p-8 max-w-3xl mx-auto pb-24 md:pb-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <CheckCircle2 size={28} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl md:text-2xl font-bold truncate">Update Task Status</h2>
                                <p className="hidden md:block text-emerald-50 text-sm mt-0.5">Keep your team informed on your progress</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <form className="space-y-6">
                                
                                {/* Task Select */}
                                <div>
                                    <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">
                                        Select Task
                                    </label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition appearance-none font-medium">
                                            <option>Complete Dashboard UI</option>
                                            <option>Fix Login Page</option>
                                            <option>API Integration</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">
                                        Current Status
                                    </label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition appearance-none font-medium">
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Comment */}
                                <div>
                                    <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wide">
                                        Comments or Notes
                                    </label>
                                    <textarea
                                        rows="4"
                                        placeholder="Explain what you worked on..."
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition resize-none font-medium"
                                    />
                                </div>

                                {/* Button */}
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-bold transition duration-300 shadow-lg shadow-emerald-200 mt-4 active:scale-[0.98]"
                                >
                                    <Send size={20} />
                                    Submit Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeUpdateStatus;
