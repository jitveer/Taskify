import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { CheckCircle2, Clock, CheckSquare } from "lucide-react";

function EmployeeDashboard() {
    const menuItems = [
        { name: "Dashboard", path: "/employee-dashboard" },
        { name: "My Tasks", path: "/employee-my-tasks" },
        { name: "Task Status", path: "/employee-task-status" },
        { name: "Update Status", path: "/employee-update-status" },
        { name: "Reports", path: "/employee-reports" }
    ];

    return (
        <div className="flex flex-col md:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            <Sidebar role="Employee" menuItems={menuItems} color="emerald" />

            <div className="flex-1 min-h-screen w-full overflow-hidden">
                <Header title="Employee Dashboard" name="Employee" role="Employee" />

                <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto pb-24 md:pb-10">
                    
                    {/* Welcome Section */}
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">Overview</h2>
                        <p className="text-slate-500 text-xs md:text-sm mt-1">A summary of your current tasks and progress.</p>
                    </div>

                    {/* Stats Grid - 3 in a row on all screens */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6 mb-8 md:mb-10">
                        
                        {/* Card 1 */}
                        <div className="bg-emerald-600 text-white p-3 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md border border-emerald-700 flex flex-col justify-between h-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-1 md:gap-0">
                                <h3 className="text-emerald-100 text-[10px] md:text-xs lg:text-sm font-semibold uppercase tracking-wider leading-tight">My Tasks</h3>
                                <CheckSquare className="text-emerald-200 hidden md:block w-4 h-4 lg:w-5 lg:h-5" />
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-1 md:gap-0">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none">12</h1>
                                <span className="text-emerald-600 bg-white text-[9px] md:text-[10px] lg:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-sm inline-block">Total</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-amber-500 text-white p-3 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md border border-amber-600 flex flex-col justify-between h-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-1 md:gap-0">
                                <h3 className="text-amber-100 text-[10px] md:text-xs lg:text-sm font-semibold uppercase tracking-wider leading-tight">Pending</h3>
                                <Clock className="text-amber-200 hidden md:block w-4 h-4 lg:w-5 lg:h-5" />
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-1 md:gap-0">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none">4</h1>
                                <span className="text-amber-600 bg-white text-[9px] md:text-[10px] lg:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-sm inline-block leading-tight md:leading-normal">Needs Action</span>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-blue-600 text-white p-3 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md border border-blue-700 flex flex-col justify-between h-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-1 md:gap-0">
                                <h3 className="text-blue-100 text-[10px] md:text-xs lg:text-sm font-semibold uppercase tracking-wider leading-tight">Completed</h3>
                                <CheckCircle2 className="text-blue-200 hidden md:block w-4 h-4 lg:w-5 lg:h-5" />
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-1 md:gap-0">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none">8</h1>
                                <span className="text-blue-600 bg-white text-[9px] md:text-[10px] lg:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-sm inline-block">Finished</span>
                            </div>
                        </div>

                    </div>

                    {/* Recent Tasks */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-base md:text-lg font-semibold text-slate-800">Recent Tasks</h2>
                            <button className="text-xs md:text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 md:px-3 py-1.5 rounded-md border border-emerald-100 transition">View All</button>
                        </div>

                        <div className="divide-y divide-slate-100">
                            
                            {/* Task 1 */}
                            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 hover:bg-slate-50 transition duration-150 border-l-4 border-l-amber-500">
                                <div>
                                    <h3 className="text-sm md:text-base font-semibold text-slate-800">Complete React Dashboard</h3>
                                    <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
                                        <Clock size={12} className="text-slate-400 md:w-[14px] md:h-[14px]" /> Deadline: Tomorrow
                                    </p>
                                </div>
                                <span className="inline-block px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold bg-amber-100 text-amber-700 self-start md:self-auto uppercase tracking-wide">
                                    Pending
                                </span>
                            </div>

                            {/* Task 2 */}
                            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 hover:bg-slate-50 transition duration-150 border-l-4 border-l-blue-500">
                                <div>
                                    <h3 className="text-sm md:text-base font-semibold text-slate-800">Update Employee Profile</h3>
                                    <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
                                        <Clock size={12} className="text-slate-400 md:w-[14px] md:h-[14px]" /> Deadline: Friday
                                    </p>
                                </div>
                                <span className="inline-block px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold bg-blue-100 text-blue-700 self-start md:self-auto uppercase tracking-wide">
                                    In Progress
                                </span>
                            </div>

                            {/* Task 3 */}
                            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 hover:bg-slate-50 transition duration-150 border-l-4 border-l-emerald-500">
                                <div>
                                    <h3 className="text-sm md:text-base font-semibold text-slate-800">Submit Weekly Report</h3>
                                    <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
                                        <CheckCircle2 size={12} className="text-slate-400 md:w-[14px] md:h-[14px]" /> Deadline: Monday
                                    </p>
                                </div>
                                <span className="inline-block px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold bg-emerald-100 text-emerald-700 self-start md:self-auto uppercase tracking-wide">
                                    Completed
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;
