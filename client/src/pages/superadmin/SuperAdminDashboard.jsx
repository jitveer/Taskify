import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { Users, Clock, CheckCircle2, ShieldAlert, ClipboardList, AlertCircle, ArrowRight } from "lucide-react";
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
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm sm:text-base font-black text-slate-800">Task Performance Overview</h3>
                                <p className="text-slate-400 text-xs hidden sm:block">Track real-time progress across all assigned tasks</p>
                            </div>
                            <button
                                onClick={() => navigate('/task-status')}
                                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                            >
                                <span>View Task Status</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Metrics Cards: Single line compact scroll on mobile, responsive grid on desktop */}
                        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                            {/* Total Tasks */}
                            <div
                                onClick={() => navigate('/task-status?filter=All')}
                                className="min-w-[130px] sm:min-w-0 flex-1 relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 hover:border-slate-300 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between group shrink-0"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
                                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-slate-100 group-hover:bg-slate-800 group-hover:text-white text-slate-600 transition-colors flex items-center justify-center">
                                        <ClipboardList className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                                    <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{dashboardData?.totalTasks || 0}</span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded">all</span>
                                </div>
                            </div>

                            {/* Completed */}
                            <div
                                onClick={() => navigate('/task-status?filter=Completed')}
                                className="min-w-[130px] sm:min-w-0 flex-1 relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 hover:border-emerald-200 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between group shrink-0"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Done</span>
                                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 transition-colors flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                                    <span className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">{dashboardData?.totalCompleted || 0}</span>
                                    <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-full">
                                        {dashboardData?.completionRate || 0}%
                                    </span>
                                </div>
                            </div>

                            {/* In Progress */}
                            <div
                                onClick={() => navigate('/task-status?filter=In Progress')}
                                className="min-w-[130px] sm:min-w-0 flex-1 relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 hover:border-blue-200 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between group shrink-0"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider">Progress</span>
                                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors flex items-center justify-center">
                                        <Clock className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                                    <span className="text-xl sm:text-2xl font-black text-blue-700 tracking-tight">{dashboardData?.totalInProgress || 0}</span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">active</span>
                                </div>
                            </div>

                            {/* Pending */}
                            <div
                                onClick={() => navigate('/task-status?filter=Pending')}
                                className="min-w-[130px] sm:min-w-0 flex-1 relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 hover:border-amber-200 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between group shrink-0"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending</span>
                                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-amber-50 group-hover:bg-amber-600 group-hover:text-white text-amber-600 transition-colors flex items-center justify-center">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                                    <span className="text-xl sm:text-2xl font-black text-amber-700 tracking-tight">{dashboardData?.totalPending || 0}</span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">waiting</span>
                                </div>
                            </div>

                            {/* Overdue */}
                            <div
                                onClick={() => navigate('/task-status')}
                                className="min-w-[130px] sm:min-w-0 flex-1 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 hover:border-red-200 transition-all duration-200 flex flex-col justify-between group shrink-0 cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-red-600 uppercase tracking-wider">Overdue</span>
                                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-red-50 group-hover:bg-red-600 group-hover:text-white text-red-600 transition-colors flex items-center justify-center">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                                    <span className="text-xl sm:text-2xl font-black text-red-700 tracking-tight">{dashboardData?.totalOverdue || 0}</span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">delayed</span>
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
