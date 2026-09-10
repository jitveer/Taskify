import { Search, Eye, X, Filter, Calendar, FileText, ChevronDown, ChevronUp, User, FileCheck, ClipboardList, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { taskApi } from "../../services/api";

function TaskStatusTable({ color, apiPrefix }) {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModalTab, setActiveModalTab] = useState("overview"); // "overview" | "reports"
    const [selectedAssigneeIndex, setSelectedAssigneeIndex] = useState(0);


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



    // URL se filter ya search query read karna
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const filterParam = queryParams.get("filter");
        const searchParam = queryParams.get("search");

        if (filterParam) {
            setFilterType(filterParam);
        }

        if (searchParam) {
            setSearchQuery(searchParam);

            // Agar tasks backend se load ho chuke hain, toh matching task dhoondhein
            if (tasks.length > 0) {
                const matchedTask = tasks.find(t =>
                    (t.title || "").toLowerCase() === searchParam.toLowerCase()
                );
                if (matchedTask) {
                    setSelectedTask(matchedTask); // Modal automatically open ho jayega!
                }
            }
        }
    }, [location.search, tasks]);




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

    // filter buttons & sorting (latest created / updated first)
    const filteredTasks = tasks
        .filter((task) => {
            const matchesSearch = (task.title || "").toLowerCase().includes(searchQuery.toLowerCase());

            // Check task status across assignments
            const hasPending = task.assignments?.some(a => (a.status || "").toLowerCase() === "pending") || (task.status || "").toLowerCase() === "pending";
            const hasInProgress = task.assignments?.some(a => (a.status || "").toLowerCase() === "in progress") || (task.status || "").toLowerCase() === "in progress";
            const hasCompleted = task.assignments?.some(a => (a.status || "").toLowerCase() === "completed") || (task.status || "").toLowerCase() === "completed";

            let matchesFilter = true;
            if (filterType === "Group Task") {
                matchesFilter = task.taskType === "group_task";
            } else if (filterType === "Individual Task") {
                matchesFilter = task.taskType === "individual";
            } else if (filterType === "Pending") {
                matchesFilter = hasPending;
            } else if (filterType === "In Progress") {
                matchesFilter = hasInProgress;
            } else if (filterType === "Completed") {
                matchesFilter = hasCompleted;
            }

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return timeB - timeA; // Descending: latest first
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

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100">
                {/* Header Section - Sticky below header */}
                <div className="sticky top-[73px] z-30 bg-white/95 backdrop-blur-md p-4 sm:p-6 border-b border-slate-100 rounded-t-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
                        <div className="relative w-[65%] sm:w-64">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 sm:pl-3 pointer-events-none text-slate-400">
                                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition`}
                            />
                        </div>

                        <div className="relative w-[40%] sm:w-52">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none text-slate-400">
                                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </span>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className={`w-full pl-7 sm:pl-9 pr-6 sm:pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition appearance-none cursor-pointer truncate font-medium text-slate-700`}
                            >
                                <option value="All">All Tasks</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Group Task">Group Tasks</option>
                                <option value="Individual Task">Individual Tasks</option>
                            </select>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none text-slate-400">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{new Date(task.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold ml-5">
                                                ⏰ {task.dueTime || "10:00"}
                                            </span>
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
                        <div key={task._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-1 relative">
                            {/* <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200/50 font-bold">
                                    Task #{index + 1}
                                </span>
                            </div> */}

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
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Due Date & Time</span>
                                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {new Date(task.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })} ({task.dueTime || "10:00"})
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
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-slideUp">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 font-mono text-xs border border-slate-200 shadow-2xs font-bold">
                                    Task Details
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(selectedTask.status)}`}>
                                    {selectedTask.status}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/60 transition flex justify-center items-center cursor-pointer shadow-2xs"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modern Segmented Navigation Tabs */}
                        <div className="px-5 pt-3 pb-1 border-b border-slate-100 bg-white">
                            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                <button
                                    onClick={() => setActiveModalTab("overview")}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${activeModalTab === "overview"
                                        ? "bg-white text-slate-800 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    <ClipboardList className="w-3.5 h-3.5" />
                                    <span>Task Overview</span>
                                </button>
                                <button
                                    onClick={() => setActiveModalTab("reports")}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${activeModalTab === "reports"
                                        ? "bg-white text-slate-800 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    <FileCheck className="w-3.5 h-3.5" />
                                    <span>Work Reports</span>
                                    {selectedTask.assignments && (
                                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-extrabold">
                                            {selectedTask.assignments.reduce((sum, a) => sum + (a.progressUpdates?.length || 0), 0)}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Modal Body: Tab 1 - Overview */}
                        {activeModalTab === "overview" && (
                            <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                                        Dept: {selectedTask.department}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${activeColor.badgeBg} ${activeColor.badgeText} border ${activeColor.badgeBorder} capitalize`}>
                                        Type: {selectedTask.taskType ? selectedTask.taskType.replace('_', ' ') : 'N/A'}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Task Title</span>
                                    <h3 className="text-base font-bold text-slate-800 leading-snug">{selectedTask.title}</h3>
                                </div>

                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Description</span>
                                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 whitespace-pre-wrap">
                                        {selectedTask.description || "No description provided."}
                                    </p>
                                </div>

                                {/* Dates Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Assign Date</span>
                                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(selectedTask.createdAt).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Due Date & Time</span>
                                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(selectedTask.dueDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold ml-5 mt-0.5">
                                            ⏰ {selectedTask.dueTime || "10:00"}
                                        </span>
                                    </div>
                                </div>

                                {/* Assignee Summary Pills */}
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                                        Assigned To ({selectedTask.assignments?.length || 0})
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTask.assignments && selectedTask.assignments.length > 0 ? (
                                            selectedTask.assignments.map((assignment, aIdx) => (
                                                <div key={aIdx} className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
                                                    <div className={`w-5 h-5 rounded-full ${activeColor.bg} ${activeColor.text} flex items-center justify-center font-bold text-[9px]`}>
                                                        {assignment.assignee?.name?.charAt(0) || "U"}
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-700">{assignment.assignee?.name || "N/A"}</span>
                                                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${getStatusColor(assignment.status)}`}>
                                                        {assignment.status}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No assignees</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Body: Tab 2 - Work Reports */}
                        {activeModalTab === "reports" && (
                            <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
                                {/* Horizontal Employee Switcher (Chips) */}
                                {selectedTask.assignments && selectedTask.assignments.length > 1 && (
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                                            Select Assignee
                                        </span>
                                        <div className="flex gap-2 overflow-x-auto pb-1">
                                            {selectedTask.assignments.map((assignment, aIdx) => {
                                                const isSelected = selectedAssigneeIndex === aIdx;
                                                const pCount = assignment.progressUpdates?.length || 0;
                                                return (
                                                    <button
                                                        key={aIdx}
                                                        onClick={() => setSelectedAssigneeIndex(aIdx)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer border ${isSelected
                                                            ? `${activeColor.bg} ${activeColor.text} border-transparent shadow-xs`
                                                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                                                            }`}
                                                    >
                                                        <span>{assignment.assignee?.name || `Employee ${aIdx + 1}`}</span>
                                                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                                                            {pCount}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Selected Assignee Progress Timeline */}
                                {selectedTask.assignments && selectedTask.assignments[selectedAssigneeIndex] ? (
                                    (() => {
                                        const currentAssignee = selectedTask.assignments[selectedAssigneeIndex];
                                        const updates = currentAssignee.progressUpdates || [];

                                        return (
                                            <div className="flex flex-col gap-3">
                                                {/* Assignee Mini Profile Header */}
                                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-8 h-8 rounded-xl ${activeColor.bg} ${activeColor.text} flex items-center justify-center font-bold text-xs shadow-2xs`}>
                                                            {currentAssignee.assignee?.name?.charAt(0) || "U"}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800">{currentAssignee.assignee?.name || "N/A"}</p>
                                                            <p className="text-[10px] text-slate-400">{currentAssignee.assignee?.user_id || "Employee"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(currentAssignee.status)}`}>
                                                            {currentAssignee.status}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                                                            {updates.length}/18 Used
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Work Logs List */}
                                                {updates.length > 0 ? (
                                                    <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                                                        {updates.map((update, uIdx) => (
                                                            <div key={uIdx} className="bg-white border border-slate-200/90 p-3 rounded-2xl flex flex-col gap-1.5 shadow-2xs">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                                        Report #{updates.length - uIdx}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                                        {new Date(update.updatedAt).toLocaleString("en-GB", {
                                                                            day: "2-digit",
                                                                            month: "short",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            hour12: true
                                                                        })}
                                                                    </span>
                                                                </div>

                                                                {update.comment && (
                                                                    <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                                                                        {update.comment}
                                                                    </p>
                                                                )}

                                                                {update.attachment && update.attachment.fileUrl && (
                                                                    <a
                                                                        href={`${import.meta.env.VITE_BACKEND_URL}${update.attachment.fileUrl}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex items-center gap-2 p-2 bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-100 rounded-xl transition text-xs font-semibold text-emerald-700 group"
                                                                    >
                                                                        <FileText className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition shrink-0" />
                                                                        <span className="truncate flex-1 text-[11px] font-bold">{update.attachment.fileName || "View Attachment"}</span>
                                                                        {update.attachment.fileSize && (
                                                                            <span className="text-[10px] text-slate-400 font-normal shrink-0">
                                                                                ({(update.attachment.fileSize / (1024 * 1024)).toFixed(2)} MB)
                                                                            </span>
                                                                        )}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-2">
                                                        <Clock className="w-6 h-6 text-slate-300" />
                                                        <p className="text-xs text-slate-400 font-medium">
                                                            No work progress reports submitted yet.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="p-6 text-center text-xs text-slate-400 italic">
                                        No assignees found for this task.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition shadow-2xs cursor-pointer"
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