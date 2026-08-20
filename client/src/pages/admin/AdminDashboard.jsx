import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskApi } from "../../services/api";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { Users, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

    const [stats, setStats] = useState({
        totalTeam: 0,
        inProgress: 0,
        pending: 0,
        completed: 0
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
                // Fetch team members
                const responseUsers = await taskApi.getAllUsers("/api/admin");
                const team = (responseUsers.users || responseUsers.employees || [])
                    .filter(u => u.role === "employee" && u.department === loggedInUser.department);
                
                // Fetch tasks assigned by admin
                const responseTasks = await taskApi.getAdminTasks();
                const tasks = responseTasks.assignedTasks || [];

                // Flatten all tasks to user assignments
                const assignmentsList = [];
                tasks.forEach(task => {
                    (task.assignments || []).forEach(assignment => {
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
                });

                const inProgressCount = assignmentsList.filter(a => (a.status || "").toLowerCase() === "in progress").length;
                const pendingCount = assignmentsList.filter(a => (a.status || "").toLowerCase() === "pending").length;
                const completedCount = assignmentsList.filter(a => (a.status || "").toLowerCase() === "completed").length;

                setStats({
                    totalTeam: team.length,
                    inProgress: inProgressCount,
                    pending: pendingCount,
                    completed: completedCount
                });

                setTeamAssignments(assignmentsList);
            } catch (error) {
                console.error("Error loading admin dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const filteredAssignments = teamAssignments.filter(a => {
        if (statusFilter === "All") return true;
        return (a.status || "").toLowerCase() === statusFilter.toLowerCase();
    });

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

                    {/* Stats Grid - 4 columns on desktop, 2 on mobile */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 md:mb-10">
                        
                        {/* Card 1 - Total Team Members */}
                        <div 
                            onClick={() => setStatusFilter("All")}
                            className="bg-blue-600 text-white p-4 lg:p-6 rounded-xl shadow-md border border-blue-700 flex flex-col justify-between h-full min-h-[120px] cursor-pointer hover:scale-[1.02] transition duration-200"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-blue-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">Total Team Members</h3>
                                <Users className="text-blue-200 w-5 h-5" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-2xl lg:text-4xl font-bold leading-none">{stats.totalTeam}</h1>
                                <span className="text-blue-600 bg-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm inline-block">Active</span>
                            </div>
                        </div>

                        {/* Card 2 - In Progress */}
                        <div 
                            onClick={() => setStatusFilter("In Progress")}
                            className="bg-sky-500 text-white p-4 lg:p-6 rounded-xl shadow-md border border-sky-600 flex flex-col justify-between h-full min-h-[120px] cursor-pointer hover:scale-[1.02] transition duration-200"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sky-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">In Progress</h3>
                                <AlertCircle className="text-sky-200 w-5 h-5" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-2xl lg:text-4xl font-bold leading-none">{stats.inProgress}</h1>
                                <span className="text-sky-600 bg-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm inline-block">On Track</span>
                            </div>
                        </div>

                        {/* Card 3 - Pending */}
                        <div 
                            onClick={() => setStatusFilter("Pending")}
                            className="bg-orange-500 text-white p-4 lg:p-6 rounded-xl shadow-md border border-orange-600 flex flex-col justify-between h-full min-h-[120px] cursor-pointer hover:scale-[1.02] transition duration-200"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-orange-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">Pending</h3>
                                <Clock className="text-orange-200 w-5 h-5" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-2xl lg:text-4xl font-bold leading-none">{stats.pending}</h1>
                                <span className="text-orange-600 bg-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm inline-block">Awaiting</span>
                            </div>
                        </div>

                        {/* Card 4 - Completed */}
                        <div 
                            onClick={() => setStatusFilter("Completed")}
                            className="bg-emerald-600 text-white p-4 lg:p-6 rounded-xl shadow-md border border-emerald-700 flex flex-col justify-between h-full min-h-[120px] cursor-pointer hover:scale-[1.02] transition duration-200"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-emerald-100 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">Completed</h3>
                                <CheckCircle2 className="text-emerald-200 w-5 h-5" />
                            </div>
                            <div className="flex items-end justify-between">
                                <h1 className="text-2xl lg:text-4xl font-bold leading-none">{stats.completed}</h1>
                                <span className="text-emerald-600 bg-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm inline-block">Finished</span>
                            </div>
                        </div>

                    </div>

                    {/* Team Tasks Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Header with status filter tabs */}
                        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                            <div>
                                <h2 className="text-base md:text-lg font-bold text-slate-800">Team Members Task Assignments</h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Click any record to inspect complete task requirements and logs.</p>
                            </div>
                            {/* Filter Tabs */}
                            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
                                {[
                                    { label: "All", value: "All" },
                                    { label: "Pending", value: "Pending" },
                                    { label: "In Progress", value: "In Progress" },
                                    { label: "Completed", value: "Completed" }
                                ].map(tab => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setStatusFilter(tab.value)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${statusFilter === tab.value
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Assignments List */}
                        <div className="divide-y divide-slate-100">
                            {loading ? (
                                <div className="p-12 text-center text-slate-500 text-sm font-medium">Loading team task records...</div>
                            ) : filteredAssignments.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 text-sm font-medium">No task assignments found under "{statusFilter}" status filter.</div>
                            ) : (
                                filteredAssignments.map((assignment, idx) => {
                                    const statusLower = (assignment.status || "").toLowerCase();
                                    const borderStyle = statusLower === "completed"
                                        ? "border-l-emerald-500"
                                        : statusLower === "in progress"
                                            ? "border-l-blue-500"
                                            : "border-l-amber-500";

                                    return (
                                        <div 
                                            key={idx} 
                                            onClick={() => setSelectedAssignment(assignment)}
                                            className={`p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 hover:bg-slate-50/70 transition duration-150 border-l-4 ${borderStyle} cursor-pointer`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-slate-800 text-sm md:text-base leading-snug">{assignment.taskTitle}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(assignment.priority)}`}>
                                                        {assignment.priority}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Assigned to: <span className="font-bold text-slate-700">{assignment.assigneeName}</span> ({assignment.assigneeUserId})
                                                </p>
                                                {assignment.comment && (
                                                    <p className="text-[11px] font-medium text-slate-400 mt-1 italic truncate">
                                                        Comment: {assignment.comment}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                                                <span className="text-[11px] font-medium text-slate-500">
                                                    Due: {new Date(assignment.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(assignment.status)}`}>
                                                    {assignment.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
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
