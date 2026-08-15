import { useState, useEffect } from "react";
import { FileText, CheckCircle2, Clock, AlertCircle, History, Tag, Calendar, MessageSquare } from "lucide-react";

function ReportsDashboard({ color }) {
    const themeColor = color === "blue" ? "blue" : color === "purple" ? "purple" : "emerald";

    const [taskList, setTaskList] = useState([]);
    const [reportData, setReportData] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0
    });

    useEffect(() => {
        // Read tasks from localStorage or initialize with defaults if not present
        const localTasks = localStorage.getItem("employee_tasks");
        let tasks = [];
        if (localTasks) {
            tasks = JSON.parse(localTasks);
        } else {
            tasks = [
                { title: "UI Dashboard Design", priority: "High", dueDate: "20 May 2026", status: "Pending", comment: "Assigned by Admin", lastUpdated: "10 Aug 2026 10:15 AM" },
                { title: "Backend API Integration", priority: "Medium", dueDate: "22 May 2026", status: "In Progress", comment: "Working on auth middleware", lastUpdated: "10 Aug 2026 02:30 PM" },
                { title: "Attendance Module", priority: "Low", dueDate: "25 May 2026", status: "Completed", comment: "Completed testing and verified DOM layout", lastUpdated: "10 Aug 2026 05:45 PM" }
            ];
            localStorage.setItem("employee_tasks", JSON.stringify(tasks));
        }

        setTaskList(tasks);

        setReportData({
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === "Completed").length,
            pendingTasks: tasks.filter(t => t.status === "Pending").length,
            inProgressTasks: tasks.filter(t => t.status === "In Progress").length
        });
    }, []);

    const getStatusColor = (status) => {
        if (status === "Completed") return "bg-green-100 text-green-700 border-green-200";
        if (status === "In Progress") return "bg-blue-100 text-blue-700 border-blue-200";
        return "bg-amber-100 text-amber-700 border-amber-200";
    };

    const getPriorityColor = (priority) => {
        if (priority === "High") return "text-red-600 bg-red-50 border-red-100";
        if (priority === "Medium") return "text-orange-600 bg-orange-50 border-orange-100";
        return "text-green-600 bg-green-50 border-green-100";
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Your Task Reports</h2>
                <p className="text-sm text-slate-500 mt-1">Overview of all your task metrics and progress history.</p>
            </div>

            {/* Cards - 2 columns on mobile, 4 columns on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                {/* Total Tasks */}
                <div className="group relative overflow-hidden bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                            <FileText size={22} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <h2 className="text-slate-500 font-medium text-xs md:text-sm mb-1 group-hover:text-emerald-50 transition-colors duration-300">
                        Total Tasks
                    </h2>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors duration-300">
                        {reportData.totalTasks}
                    </h1>
                </div>

                {/* Completed */}
                <div className="group relative overflow-hidden bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 bg-green-100 text-green-600 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                            <CheckCircle2 size={22} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <h2 className="text-slate-500 font-medium text-xs md:text-sm mb-1 group-hover:text-green-50 transition-colors duration-300">Completed</h2>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors duration-300">{reportData.completedTasks}</h1>
                </div>

                {/* Pending */}
                <div className="group relative overflow-hidden bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                            <Clock size={22} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <h2 className="text-slate-500 font-medium text-xs md:text-sm mb-1 group-hover:text-amber-50 transition-colors duration-300">Pending</h2>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors duration-300">{reportData.pendingTasks}</h1>
                </div>

                {/* In Progress */}
                <div className="group relative overflow-hidden bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                            <AlertCircle size={22} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <h2 className="text-slate-500 font-medium text-xs md:text-sm mb-1 group-hover:text-blue-50 transition-colors duration-300">In Progress</h2>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors duration-300">{reportData.inProgressTasks}</h1>
                </div>
            </div>

            {/* Task Progress & Assignment History Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
                    <History className="text-slate-500 w-5 h-5" />
                    <div>
                        <h2 className="text-base md:text-lg font-bold text-slate-800">Task Activity & Update History</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">A complete audit log of when tasks were assigned, updated, and completed.</p>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {taskList.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-medium text-sm">
                            No task activity found.
                        </div>
                    ) : (
                        taskList.map((task, index) => (
                            <div key={index} className="p-6 hover:bg-slate-50/55 transition duration-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-2 max-w-2xl">
                                    <div className="flex items-center flex-wrap gap-2">
                                        <h3 className="text-base font-bold text-slate-800 leading-snug">{task.title}</h3>
                                        <span className={`px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5 pt-1">
                                        {task.comment && (
                                            <p className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex items-start gap-1.5 font-medium">
                                                <MessageSquare size={13} className="text-slate-400 mt-0.5 shrink-0" />
                                                <span><strong className="text-slate-700">Latest Comment:</strong> {task.comment}</span>
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-wider pl-1 pt-1 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} /> Due: {task.dueDate}
                                            </span>
                                            {task.lastUpdated && (
                                                <span className="flex items-center gap-1 text-slate-500">
                                                    <Clock size={12} /> Last Updated: {task.lastUpdated}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right shrink-0 self-end md:self-auto">
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider border border-slate-200">
                                        Task Audit Verified
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReportsDashboard;