import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { Users, Clock, CheckCircle2, ShieldAlert } from "lucide-react";

function SuperAdminDashboard() {

    const [dashboardData, setDashboardData] = useState(null);

    const menuItems = [
        { name: "Dashboard", path: "/super-admin-dashboard" },
        { name: "Admin List", path: "/admin-list" },
        { name: "Employee List", path: "/employee-list" },
        { name: "Assign Task", path: "/assign-task" },
        { name: "My Tasks", path: "/my-tasks" },
        { name: "Task Status", path: "/task-status" },
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

            console.log("API SUCCESS");
            console.log("DATA:", res.data);

            setDashboardData(res.data);

        } catch (error) {
            console.log("API FAILED");
            console.log("ERROR:", error);
        }
    };



    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Super Admin" menuItems={menuItems} color="purple" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full overflow-hidden">
                {/* Header */}
                <Header title="Super Admin" name="Super Admin" role="Super Admin" />

                <div className="p-4 lg:p-8 lg:p-10 max-w-7xl mx-auto pb-24 lg:pb-10">

                    {/* Welcome Section */}
                    <div className="mb-6 lg:mb-8">
                        <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 font-bold tracking-tight">Super Admin Overview</h2>
                        <p className="text-slate-500 text-xs lg:text-sm mt-1">Manage all administrators, employees, and operations.</p>
                    </div>

                    {/* Stats Grid - 4 in a row on desktop/tablet */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-10">

                        {/* Card 1: Total Admins */}
                        <div className="bg-purple-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg shadow-purple-100 border border-purple-700 flex flex-col justify-between h-full group hover:scale-[1.02] transition-transform duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-purple-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider">Total Admins</h3>
                                <ShieldAlert className="text-purple-200 w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-3xl lg:text-4xl font-black leading-none tracking-tight">12</h1>
                                <span className="text-[10px] lg:text-xs font-bold px-2 py-1 bg-white/20 rounded backdrop-blur-sm">Active</span>
                            </div>
                        </div>

                        {/* Card 2: Total Employees */}
                        <div className="bg-blue-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg shadow-blue-100 border border-blue-700 flex flex-col justify-between h-full group hover:scale-[1.02] transition-transform duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-blue-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider">Total Staff</h3>
                                <Users className="text-blue-200 w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-3xl lg:text-4xl font-black leading-none tracking-tight">120</h1>
                                <span className="text-[10px] lg:text-xs font-bold px-2 py-1 bg-white/20 rounded backdrop-blur-sm">Global</span>
                            </div>
                        </div>

                        {/* Card 3: Global Pending */}
                        <div className="bg-orange-500 text-white p-4 lg:p-6 rounded-2xl shadow-lg shadow-orange-100 border border-orange-600 flex flex-col justify-between h-full group hover:scale-[1.02] transition-transform duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-orange-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider">Total Pending</h3>
                                <Clock className="text-orange-200 w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-3xl lg:text-4xl font-black leading-none tracking-tight">18</h1>
                                <span className="text-[10px] lg:text-xs font-bold px-2 py-1 bg-white/20 rounded backdrop-blur-sm">All Teams</span>
                            </div>
                        </div>

                        {/* Card 4: Global Completed */}
                        <div className="bg-emerald-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg shadow-emerald-100 border border-emerald-700 flex flex-col justify-between h-full group hover:scale-[1.02] transition-transform duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-emerald-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider">Completed</h3>
                                <CheckCircle2 className="text-emerald-200 w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-3xl lg:text-4xl font-black leading-none tracking-tight">86</h1>
                                <span className="text-[10px] lg:text-xs font-bold px-2 py-1 bg-white/20 rounded backdrop-blur-sm">This Month</span>
                            </div>
                        </div>

                    </div>

                    {/* Recent Global Operations */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-5 lg:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                            <h2 className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight">Recent Global Tasks</h2>
                            <button className="text-xs lg:text-sm font-bold text-purple-600 hover:text-purple-700 transition px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">View Master List</button>
                        </div>

                        <div className="divide-y divide-slate-100">

                            {/* Task 1 */}
                            <div className="p-5 lg:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 transition-colors border-l-4 border-l-amber-500">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-base lg:text-lg font-bold text-slate-800">Complete UI Design</h3>
                                        <p className="text-xs lg:text-sm text-slate-500 mt-0.5">Assigned to <span className="text-slate-700 font-bold underline decoration-slate-300 underline-offset-2">John Doe</span> (Admin: <span className="font-semibold italic">HR Dept</span>)</p>
                                    </div>
                                </div>
                                <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase tracking-widest text-center self-start lg:self-auto">
                                    Pending
                                </span>
                            </div>

                            {/* Task 2 */}
                            <div className="p-5 lg:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 transition-colors border-l-4 border-l-emerald-500">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-base lg:text-lg font-bold text-slate-800">Backend API Integration</h3>
                                        <p className="text-xs lg:text-sm text-slate-500 mt-0.5">Assigned to <span className="text-slate-700 font-bold underline decoration-slate-300 underline-offset-2">Sarah Smith</span> (Admin: <span className="font-semibold italic">IT Dept</span>)</p>
                                    </div>
                                </div>
                                <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-widest text-center self-start lg:self-auto">
                                    Completed
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SuperAdminDashboard;
