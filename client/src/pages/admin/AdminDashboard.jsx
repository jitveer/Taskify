import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { Users, Clock, CheckCircle2 } from "lucide-react";

function AdminDashboard() {

    const menuItems = [
        { name: "Dashboard", path: "/admin-dashboard" },
        { name: "Employee List", path: "/admin-employee-list" },
        { name: "Assign Task", path: "/admin-assign-task" },
        { name: "My Tasks", path: "/admin-my-tasks" },
        { name: "Task Status", path: "/admin-task-status" },
        { name: "Reports", path: "/admin-reports" }
    ];

    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Admin" menuItems={menuItems} color="blue" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full overflow-hidden">
                {/* Header */}
                <Header title="Admin Dashboard" name="Admin" role="Admin" />

                <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto pb-24 md:pb-10">
                    
                    {/* Welcome Section */}
                    <div className="mb-6 lg:mb-8">
                        <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Admin Overview</h2>
                        <p className="text-slate-500 text-xs lg:text-sm mt-1">A high-level view of your team and tasks.</p>
                    </div>

                    {/* Stats Grid - 3 in a row on all screens */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6 mb-8 md:mb-10">
                        
                        {/* Card 1 */}
                        <div className="bg-blue-600 text-white p-3 lg:p-5 lg:p-6 rounded-lg lg:rounded-xl shadow-md border border-blue-700 flex flex-col justify-between h-full">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 lg:mb-4 gap-1 lg:gap-0">
                                <h3 className="text-blue-100 text-[10px] lg:text-xs lg:text-sm font-semibold uppercase tracking-wider leading-tight">Total Staff</h3>
                                <Users className="text-blue-200 hidden lg:block w-4 h-4 lg:w-5 lg:h-5" />
                            </div>
                            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-1 lg:gap-0">
                                <h1 className="text-2xl lg:text-3xl lg:text-4xl font-bold leading-none">85</h1>
                                <span className="text-blue-600 bg-white text-[9px] md:text-[10px] lg:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-sm inline-block">Active</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-orange-500 text-white p-3 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md border border-orange-600 flex flex-col justify-between h-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-1 md:gap-0">
                                <h3 className="text-orange-100 text-[10px] md:text-xs lg:text-sm font-semibold uppercase tracking-wider leading-tight">Pending</h3>
                                <Clock className="text-orange-200 hidden md:block w-4 h-4 lg:w-5 lg:h-5" />
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-1 md:gap-0">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none">14</h1>
                                <span className="text-orange-600 bg-white text-[9px] md:text-[10px] lg:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-sm inline-block leading-tight md:leading-normal">Team Tasks</span>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-emerald-600 text-white p-3 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-md border border-emerald-700 flex flex-col justify-between h-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-4 gap-1 md:gap-0">
                                <h3 className="text-emerald-100 text-[10px] md:text-xs lg:text-sm font-semibold uppercase tracking-wider leading-tight">Completed</h3>
                                <CheckCircle2 className="text-emerald-200 hidden md:block w-4 h-4 lg:w-5 lg:h-5" />
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-1 md:gap-0">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none">62</h1>
                                <span className="text-emerald-600 bg-white text-[9px] md:text-[10px] lg:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-sm inline-block">All Time</span>
                            </div>
                        </div>

                    </div>

                    {/* Recent Tasks */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-base md:text-lg font-semibold text-slate-800">Recent Assignments</h2>
                            <button className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 md:px-3 py-1.5 rounded-md border border-blue-100 transition">View All</button>
                        </div>

                        <div className="divide-y divide-slate-100">
                            
                            {/* Task 1 */}
                            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 hover:bg-slate-50 transition duration-150 border-l-4 border-l-amber-500">
                                <div>
                                    <h3 className="text-sm md:text-base font-semibold text-slate-800">Create Employee Dashboard</h3>
                                    <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
                                        Assigned to <span className="font-bold text-slate-700">Rahul</span>
                                    </p>
                                </div>
                                <span className="inline-block px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold bg-amber-100 text-amber-700 self-start md:self-auto uppercase tracking-wide">
                                    Pending
                                </span>
                            </div>

                            {/* Task 2 */}
                            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 hover:bg-slate-50 transition duration-150 border-l-4 border-l-emerald-500">
                                <div>
                                    <h3 className="text-sm md:text-base font-semibold text-slate-800">Attendance API Integration</h3>
                                    <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
                                        Assigned to <span className="font-bold text-slate-700">Priya</span>
                                    </p>
                                </div>
                                <span className="inline-block px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold bg-emerald-100 text-emerald-700 self-start md:self-auto uppercase tracking-wide">
                                    Completed
                                </span>
                            </div>

                            {/* Task 3 */}
                            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 hover:bg-slate-50 transition duration-150 border-l-4 border-l-blue-500">
                                <div>
                                    <h3 className="text-sm md:text-base font-semibold text-slate-800">Fix Login Validation</h3>
                                    <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
                                        Assigned to <span className="font-bold text-slate-700">Karan</span>
                                    </p>
                                </div>
                                <span className="inline-block px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold bg-blue-100 text-blue-700 self-start md:self-auto uppercase tracking-wide">
                                    In Progress
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;
