import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskApi } from "../../services/api";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { Users, Clock, CheckCircle2, AlertCircle, FileText, ClipboardList, Sparkles, Activity, ArrowRight } from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

    const [stats, setStats] = useState({
        totalTeam: 0,
        totalTasks: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0,
        completionRate: 0
    });
    const [teamAssignments, setTeamAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    const menuItems = [
        { name: "Dashboard", path: "/admin-dashboard" },
        { name: "Employee List", path: "/admin-employee-list" },
        { name: "Add Task", path: "/admin-assign-task" },
        { name: "My Tasks", path: "/admin-my-tasks" },
        { name: "Tasks Assigned by Me", path: "/admin-task-status" },
        { name: "Reports", path: "/admin-reports" }
    ];

    const getStatusColor = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "completed") return "bg-green-100 text-green-700 border-green-200";
        if (s === "in progress") return "bg-blue-100 text-blue-700 border-blue-200";
        if (s === "rejected") return "bg-red-100 text-red-700 border-red-200";
        return "bg-amber-100 text-amber-700 border-amber-200";
    };

    const getPriorityColor = (priority) => {
        const p = (priority || "").toLowerCase();
        if (p === "high" || p === "urgent") return "text-red-600 bg-red-50 border-red-100";
        if (p === "medium") return "text-orange-600 bg-orange-50 border-orange-100";
        return "text-green-600 bg-green-50 border-green-100";
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Fetch team members of admin's department
                const responseUsers = await taskApi.getAllUsers("/api/admin");
                const team = (responseUsers.users || responseUsers.employees || [])
                    .filter(u => u.role === "employee" && u.department === loggedInUser.department);

                // Fetch tasks assigned by this admin
                const responseTasks = await taskApi.getAdminTasks();
                const tasks = responseTasks.assignedTasks || [];

                const assignmentsList = [];
                let totalOverdue = 0;
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                tasks.forEach(task => {
                    let taskIsCompleted = true;
                    (task.assignments || []).forEach(assignment => {
                        const st = (assignment.status || "").toLowerCase();
                        if (st !== "completed") {
                            taskIsCompleted = false;
                        }
                        assignmentsList.push({
                            taskTitle: task.title,
                            description: task.description,
                            priority: task.priority,
                            dueDate: assignment.dueDate || task.dueDate,
                            assignedAt: assignment.assignedAt || task.createdAt,
                            attachments: task.attachments || [],
                            assigneeName: assignment.assignee?.name || "Unknown",
                            assigneeUserId: assignment.assignee?.user_id || "N/A",
                            status: assignment.status || "Pending",
                            comment: assignment.comment,
                            completedAt: assignment.completedAt
                        });
                    });

                    // Check if task is overdue
                    if (!taskIsCompleted && task.dueDate) {
                        const dDate = new Date(task.dueDate);
                        dDate.setHours(0, 0, 0, 0);
                        if (dDate < now) {
                            totalOverdue++;
                        }
                    }
                });

                assignmentsList.sort((a, b) => new Date(b.assignedAt || 0) - new Date(a.assignedAt || 0));

                const inProgressCount = assignmentsList.filter(a => (a.status || "").toLowerCase() === "in progress").length;
                const pendingCount = assignmentsList.filter(a => (a.status || "").toLowerCase() === "pending").length;
                const completedCount = assignmentsList.filter(a => (a.status || "").toLowerCase() === "completed").length;
                const totalAssignments = assignmentsList.length;
                const rate = totalAssignments > 0 ? Math.round((completedCount / totalAssignments) * 100) : 0;

                setStats({
                    totalTeam: team.length,
                    totalTasks: tasks.length,
                    inProgress: inProgressCount,
                    pending: pendingCount,
                    completed: completedCount,
                    overdue: totalOverdue,
                    completionRate: rate
                });

                setTeamAssignments(assignmentsList);
            } catch (error) {
                console.error("Error loading admin dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [loggedInUser.department]);

    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Admin" menuItems={menuItems} color="blue" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full">
                {/* Header */}
                <Header title="Admin Dashboard" name="Admin" role="Admin" />

                <div className="p-4 lg:p-8 lg:p-10 max-w-7xl mx-auto pb-24 lg:pb-10 space-y-6 lg:space-y-8">

                    {/* Welcome Section */}
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">Admin Overview</h2>
                        <p className="text-slate-500 text-xs lg:text-sm mt-1">
                            Manage department team members and monitor assigned tasks ({loggedInUser.department ? loggedInUser.department.toUpperCase() : "General"}).
                        </p>
                    </div>

                    {/* Department Staff Stats Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-6">
                        {/* Team Members Card */}
                        <div
                            onClick={() => navigate("/admin-employee-list")}
                            className="cursor-pointer bg-blue-600 text-white p-4 lg:p-6 rounded-2xl shadow-lg shadow-blue-100 border border-blue-700 flex flex-col justify-between h-full group hover:scale-[1.01] transition-transform duration-300"
                        >
                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <h3 className="text-blue-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider">Department Staff</h3>
                                <Users className="text-blue-200 w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-none tracking-tight">{stats.totalTeam}</h1>
                                <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold px-2 py-0.5 sm:py-1 bg-white/20 rounded backdrop-blur-sm">
                                    {loggedInUser.department ? loggedInUser.department.toUpperCase() : "Active"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Task Performance & Analytics Section */}
                    <div className="space-y-3.5">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gradient-to-r from-blue-50/70 via-sky-50/40 to-transparent p-3 sm:p-4 rounded-2xl border border-blue-100/60">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                                    <Activity className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm sm:text-base font-extrabold text-slate-800">Task Performance Overview</h3>
                                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200/60">
                                            <Sparkles className="w-2.5 h-2.5" /> Real-time
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-xs mt-0.5">Live status & execution metrics across tasks assigned by you</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/admin-task-status')}
                                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer group shrink-0"
                            >
                                <span>Detailed Task Status</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        {/* Task Performance Metrics Grid (Non-scrollable, responsive on mobile & tablet) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                            {/* Card 1: Total Tasks */}
                            <div
                                onClick={() => navigate('/admin-task-status?filter=All')}
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
                                    <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{stats.totalTasks}</span>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                        All
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: Completed */}
                            <div
                                onClick={() => navigate('/admin-task-status?filter=Completed')}
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
                                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">{stats.completed}</span>
                                    <span className="text-[10px] sm:text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                        {stats.completionRate}%
                                    </span>
                                </div>
                            </div>

                            {/* Card 3: In Progress */}
                            <div
                                onClick={() => navigate('/admin-task-status?filter=In Progress')}
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
                                    <span className="text-2xl sm:text-3xl font-black text-blue-700 tracking-tight">{stats.inProgress}</span>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                                        Active
                                    </span>
                                </div>
                            </div>

                            {/* Card 4: Pending */}
                            <div
                                onClick={() => navigate('/admin-task-status?filter=Pending')}
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
                                    <span className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight">{stats.pending}</span>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                        Waiting
                                    </span>
                                </div>
                            </div>

                            {/* Card 5: Overdue */}
                            <div
                                onClick={() => navigate('/admin-task-status')}
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
                                    <span className="text-2xl sm:text-3xl font-black text-red-700 tracking-tight">{stats.overdue}</span>
                                    <span className="text-[10px] sm:text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                        Delayed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Task View Modal */}
            {selectedAssignment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 border-t-4 border-t-blue-600">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200/50 font-bold">
                                    Task Details
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedAssignment.status)}`}>
                                    {selectedAssignment.status}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedAssignment(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition flex justify-center items-center cursor-pointer font-bold text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 flex flex-col gap-5 overflow-y-auto">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Task Title</span>
                                <h3 className="text-lg font-bold text-slate-800 leading-snug">{selectedAssignment.taskTitle}</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Priority</span>
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedAssignment.priority)}`}>
                                        {selectedAssignment.priority}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Assignee</span>
                                    <p className="text-xs font-bold text-slate-700">{selectedAssignment.assigneeName} ({selectedAssignment.assigneeUserId})</p>
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Description</span>
                                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mt-1 whitespace-pre-wrap">
                                    {selectedAssignment.description || "No description provided."}
                                </p>
                            </div>

                            {selectedAssignment.comment && (
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Latest Comment / Status Update Notes</span>
                                    <p className="text-xs text-slate-500 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 mt-1">
                                        "{selectedAssignment.comment}"
                                    </p>
                                </div>
                            )}

                            {/* Dates Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Assign Date</span>
                                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        {new Date(selectedAssignment.assignedAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Due Date</span>
                                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        {new Date(selectedAssignment.dueDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Attachments */}
                            {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Attachments</span>
                                    <div className="flex flex-col gap-1.5 mt-1">
                                        {selectedAssignment.attachments.map((file, fIdx) => (
                                            <a
                                                key={fIdx}
                                                href={`${import.meta.env.VITE_BACKEND_URL}${file.fileUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition text-xs font-bold text-slate-700"
                                            >
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                <span className="truncate flex-1">{file.fileName || "View Attachment"}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button
                                onClick={() => setSelectedAssignment(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition shadow-sm cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
