import { Search, Eye, X, Filter, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { taskApi } from "../../services/api";

function TaskStatusTable({ color, apiPrefix }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch employee and admin from task table using centralized services
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                let response;
                if (apiPrefix === "/api/superadmin") {
                    response = await taskApi.getSuperAdminTasks();
                } else {
                    response = await taskApi.getAdminTasks();
                }

                if (response && response.success) {
                    const mappedTasks = (response.assignedTasks || []).map(t => {
                        const completed = t.assignments?.filter(a => a.status === "Completed").length || 0;
                        const progress = t.assignments?.length > 0
                            ? Math.round((completed / t.assignments.length) * 100) + "%"
                            : "0%";
                        return {
                            ...t,
                            progress
                        };
                    });
                    setTasks(mappedTasks);
                }
            } catch (error) {
                console.error("Task List Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [apiPrefix]);

    const getStatusColor = (status) => {
        if (status === "Completed") return "bg-green-100 text-green-700 border border-green-200/50";
        if (status === "In Progress") return "bg-blue-100 text-blue-700 border border-blue-200/50";
        if (status === "Rejected") return "bg-red-100 text-red-700 border border-red-200/50";
        return "bg-amber-100 text-amber-700 border border-amber-200/50";
    };

    const colorClasses = {
        blue: {
            text: "text-blue-600",
            hoverText: "hover:text-blue-600",
            bg: "bg-blue-100",
            hoverBg: "hover:bg-blue-50",
            border: "border-blue-200",
            accentBg: "bg-blue-600",
            badgeBg: "bg-blue-50",
            badgeText: "text-blue-700",
            badgeBorder: "border-blue-100",
            ring: "focus:ring-blue-100",
            focusBorder: "focus:border-blue-300"
        },
        purple: {
            text: "text-purple-600",
            hoverText: "hover:text-purple-600",
            bg: "bg-purple-100",
            hoverBg: "hover:bg-purple-50",
            border: "border-purple-200",
            accentBg: "bg-purple-600",
            badgeBg: "bg-purple-50",
            badgeText: "text-purple-700",
            badgeBorder: "border-purple-100",
            ring: "focus:ring-purple-100",
            focusBorder: "focus:border-purple-300"
        },
        emerald: {
            text: "text-emerald-600",
            hoverText: "hover:text-emerald-600",
            bg: "bg-emerald-100",
            hoverBg: "hover:bg-emerald-50",
            border: "border-emerald-200",
            accentBg: "bg-emerald-600",
            badgeBg: "bg-emerald-50",
            badgeText: "text-emerald-700",
            badgeBorder: "border-emerald-100",
            ring: "focus:ring-emerald-100",
            focusBorder: "focus:border-emerald-300"
        }
    };

    const activeColor = colorClasses[color] || colorClasses.emerald;

    // filter buttons
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = (task.title || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterType === "All" ||
            (filterType === "Group Task" && task.taskType === "group_task") ||
            (filterType === "Individual Task" && task.taskType === "individual");

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(16px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}} />

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Team Task Status</h2>
                        <p className="text-sm text-slate-500 mt-1">Monitor the progress of your team members.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1 sm:flex-initial">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full sm:w-64 pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition`}
                            />
                        </div>

                        <div className="relative flex-1 sm:flex-initial">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <Filter className="w-4 h-4" />
                            </span>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className={`w-full sm:w-48 pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition appearance-none cursor-pointer`}
                            >
                                <option value="All">All Tasks</option>
                                <option value="Group Task">Group Task</option>
                                <option value="Individual Task">Individual Task</option>
                            </select>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 whitespace-nowrap">ID</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 whitespace-nowrap">Title</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 whitespace-nowrap">Assign Date</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 whitespace-nowrap">Due Date</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 whitespace-nowrap">Assignments & Status</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 text-center whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((task, index) => (
                                <tr key={task._id} className="hover:bg-slate-50 transition border-b border-slate-50 last:border-none">
                                    <td className="py-4 px-6 text-sm font-bold text-slate-800 whitespace-nowrap">
                                        {index + 1}
                                    </td>

                                    <td className="py-4 px-6 text-sm font-semibold text-slate-700 min-w-[200px]">
                                        <div className="flex flex-col">
                                            <span className="whitespace-nowrap">{task.title}</span>
                                            <span className="text-[10px] text-slate-400 font-normal mt-0.5 whitespace-nowrap">{task.department} • {task.taskType}</span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-sm font-medium text-slate-500 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>
                                                {new Date(task.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-sm font-medium text-slate-500 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>{new Date(task.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-sm">
                                        <div className="flex flex-col gap-1.5">
                                            {task.assignments && task.assignments.length > 0 ? (
                                                task.assignments.map((assignment, aIdx) => (
                                                    <div key={aIdx} className="flex items-center gap-2">
                                                        <span className="font-semibold text-slate-700">{assignment.assignee?.name || "N/A"}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(assignment.status)}`}>
                                                            {assignment.status}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">No assignments</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                        <button
                                            onClick={() => setSelectedTask(task)}
                                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 ${activeColor.hoverText} ${activeColor.hoverBg} transition cursor-pointer whitespace-nowrap`}
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                                        No tasks found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden flex flex-col gap-4 p-4 bg-slate-50/50">
                    {filteredTasks.map((task, index) => (
                        <div key={task._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 relative">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200/50 font-bold">
                                    Task #{index + 1}
                                </span>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base leading-snug">{task.title}</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-1">{task.department} • {task.taskType}</p>
                                </div>
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assignments</span>
                                    {task.assignments && task.assignments.length > 0 ? (
                                        task.assignments.map((assignment, aIdx) => (
                                            <div key={aIdx} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                <span className="text-xs font-semibold text-slate-700">{assignment.assignee?.name || "N/A"}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(assignment.status)}`}>
                                                    {assignment.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">No assignments</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Assign Date</span>
                                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {new Date(task.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Due Date</span>
                                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {new Date(task.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    onClick={() => setSelectedTask(task)}
                                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white ${activeColor.accentBg} hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm`}
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredTasks.length === 0 && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-sm">
                            No tasks found matching your criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Task View Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col animate-slideUp">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200/50 font-bold">
                                    Task Details
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition flex justify-center items-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
                            <div className="flex flex-wrap gap-3">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Department</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                        {selectedTask.department}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Task Type</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activeColor.badgeBg} ${activeColor.badgeText} border ${activeColor.badgeBorder}`}>
                                        {selectedTask.taskType ? selectedTask.taskType.replace('_', ' ') : ''}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Task Title</span>
                                <h3 className="text-xl font-bold text-slate-800 leading-snug">{selectedTask.title}</h3>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Assigned Employees</span>
                                <div className="flex flex-col gap-2 mt-2">
                                    {selectedTask.assignments && selectedTask.assignments.length > 0 ? (
                                        selectedTask.assignments.map((assignment, aIdx) => (
                                            <div key={aIdx} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-6 h-6 rounded-full ${activeColor.bg} ${activeColor.text} flex justify-center items-center font-bold text-[10px]`}>
                                                            {assignment.assignee?.name?.charAt(0) || "U"}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">{assignment.assignee?.name || "N/A"}</span>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(assignment.status)}`}>
                                                        {assignment.status}
                                                    </span>
                                                </div>
                                                {assignment.comment && (
                                                    <p className="text-[11px] text-slate-500 italic bg-amber-50/40 p-2 rounded-xl border border-amber-100/40 mt-1 pl-8">
                                                        "Latest: {assignment.comment}"
                                                    </p>
                                                )}
                                                {assignment.history && assignment.history.length > 0 && (
                                                    <details className="mt-1 pl-8 group">
                                                        <summary className="text-[10px] text-blue-600 font-bold uppercase tracking-wider cursor-pointer hover:underline list-none flex items-center gap-1 select-none">
                                                            <span>View Activity Logs ({assignment.history.length})</span>
                                                        </summary>
                                                        <div className="mt-3 border-l-2 border-slate-100 pl-3.5 space-y-3.5">
                                                            {assignment.history.map((log, lIdx) => (
                                                                <div key={lIdx} className="relative">
                                                                    <span className="absolute -left-[19.5px] top-1 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-slate-50"></span>
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                                            Status: {log.newValue}
                                                                        </span>
                                                                    </div>
                                                                    {log.comment && (
                                                                        <p className="text-xs text-slate-600 mt-1 bg-white p-2 rounded-xl border border-slate-100/60 leading-normal">
                                                                            "{log.comment}"
                                                                        </p>
                                                                    )}
                                                                    <span className="text-[9px] text-slate-400 font-medium block mt-1">
                                                                        {new Date(log.createdAt).toLocaleString("en-GB", {
                                                                            day: "2-digit",
                                                                            month: "short",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            hour12: true
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </details>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">No assignments</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Description</span>
                                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100/50 mt-1 whitespace-pre-wrap">
                                    {selectedTask.description}
                                </p>
                            </div>

                            {/* Dates Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Assign Date</span>
                                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {new Date(selectedTask.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Due Date</span>
                                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {new Date(selectedTask.dueDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar in Modal */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Progress</span>
                                    <span className="text-xs font-bold text-slate-700">{selectedTask.progress}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${selectedTask.progress === '100%' ? 'bg-green-500' : 'bg-amber-500'}`}
                                        style={{ width: selectedTask.progress }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition shadow-sm cursor-pointer"
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

export default TaskStatusTable;