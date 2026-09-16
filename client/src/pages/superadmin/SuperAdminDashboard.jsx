import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { Users, Clock, CheckCircle2, ShieldAlert, ClipboardList, AlertCircle, ArrowRight, Sparkles, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);

    const menuItems = [
        { name: "Dashboard", path: "/super-admin-dashboard" },
        { name: "Admin List", path: "/admin-list" },
        { name: "Employee List", path: "/employee-list" },
        { name: "Add Task", path: "/assign-task" },
        { name: "Tasks Assigned by Me", path: "/task-status" },
        { name: "Reports", path: "/reports" }
    ];

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/superadmin/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDashboardData(res.data);

        } catch (error) {
            console.log("API FAILED", error);
        }
    };


    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Super Admin" menuItems={menuItems} color="purple" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full">
                {/* Header */}
                <Header title="Super Admin" name="Super Admin" role="Super Admin" />

                <div className="p-4 lg:p-8 lg:p-10 max-w-7xl mx-auto pb-24 lg:pb-10 space-y-6 lg:space-y-8">

                    {/* Welcome Section */}
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">Super Admin Overview</h2>
                        <p className="text-slate-500 text-xs lg:text-sm mt-1">Manage all administrators, employees, and organization tasks.</p>
                    </div>

                    {/* User & Staff Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 lg:gap-6">
                        {/* Card 1: Total Admins */}
                        <div onClick={() => navigate('/admin-list')} className="cursor-pointer bg-purple-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg shadow-purple-100 border border-purple-700 flex flex-col justify-between h-full group hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <h3 className="text-purple-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider">Total Admins</h3>
                                <ShieldAlert className="text-purple-200 w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-none tracking-tight">{dashboardData?.totalAdmins || 0}</h1>
                                <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold px-2 py-0.5 sm:py-1 bg-white/20 rounded backdrop-blur-sm">Active</span>
                            </div>
                        </div>

                        {/* Card 2: Total Employees */}
                        <div onClick={() => navigate('/employee-list')} className="cursor-pointer bg-blue-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg shadow-blue-100 border border-blue-700 flex flex-col justify-between h-full group hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <h3 className="text-blue-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider">Total Staff</h3>
                                <Users className="text-blue-200 w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-none tracking-tight">{dashboardData?.totalEmployees || 0}</h1>
                                <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold px-2 py-0.5 sm:py-1 bg-white/20 rounded backdrop-blur-sm">Global</span>
                            </div>
                        </div>
                    </div>

                    {/* Task Performance & Analytics Section */}
                    <div className="space-y-3.5">
                        {/* Premium Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-transparent p-3 sm:p-4 rounded-2xl border border-purple-100/60">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                                    <Activity className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm sm:text-base font-extrabold text-slate-800">Task Performance Overview</h3>
                                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200/60">
                                            <Sparkles className="w-2.5 h-2.5" /> Real-time
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-xs mt-0.5">Live status & execution metrics across all assigned tasks</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/task-status')}
                                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-white hover:bg-purple-600 hover:text-white border border-purple-200 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer group shrink-0"
                            >
                                <span>Detailed Task Status</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        {/* Task Performance Metrics Grid (Non-scrollable, responsive on mobile & tablet) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                            {/* Card 1: Total Tasks */}
                            <div
                                onClick={() => navigate('/task-status?filter=All')}
                                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110 pointer-events-none" />
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tasks</span>
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                                        <ClipboardList className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4 flex items-baseline justify-between relative z-10">
                                    <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{dashboardData?.totalTasks || 0}</span>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                        All
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: Completed */}
                            <div
                                onClick={() => navigate('/task-status?filter=Completed')}
                                className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50/50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110 pointer-events-none" />
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[11px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider">Completed</span>
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4 flex items-baseline justify-between relative z-10">
                                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">{dashboardData?.totalCompleted || 0}</span>
                                    <span className="text-[10px] sm:text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                        {dashboardData?.completionRate || 0}%
                                    </span>
                                </div>
                            </div>

                            {/* Card 3: In Progress */}
                            <div
                                onClick={() => navigate('/task-status?filter=In Progress')}
                                className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-100/80 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110 pointer-events-none" />
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[11px] sm:text-xs font-bold text-blue-700 uppercase tracking-wider">In Progress</span>
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4 flex items-baseline justify-between relative z-10">
                                    <span className="text-2xl sm:text-3xl font-black text-blue-700 tracking-tight">{dashboardData?.totalInProgress || 0}</span>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                                        Active
                                    </span>
                                </div>
                            </div>

                            {/* Card 4: Pending */}
                            <div
                                onClick={() => navigate('/task-status?filter=Pending')}
                                className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-100/80 hover:border-amber-300 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50/50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110 pointer-events-none" />
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[11px] sm:text-xs font-bold text-amber-700 uppercase tracking-wider">Pending</span>
                                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4 flex items-baseline justify-between relative z-10">
                                    <span className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight">{dashboardData?.totalPending || 0}</span>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                        Waiting
                                    </span>
                                </div>
                            </div>

                            {/* Card 5: Overdue */}
                            <div
                                onClick={() => navigate('/task-status')}
                                className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 sm:p-5 border border-red-100/80 hover:border-red-300 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-red-50/50 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110 pointer-events-none" />
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[11px] sm:text-xs font-bold text-red-600 uppercase tracking-wider">Overdue</span>
                                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4 flex items-baseline justify-between relative z-10">
                                    <span className="text-2xl sm:text-3xl font-black text-red-700 tracking-tight">{dashboardData?.totalOverdue || 0}</span>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                        Delayed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SuperAdminDashboard;
