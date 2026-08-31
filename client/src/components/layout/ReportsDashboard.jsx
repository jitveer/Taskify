import { useState, useEffect } from "react";
import { FileText, CheckCircle2, Clock, AlertCircle, History, Tag, Calendar, MessageSquare } from "lucide-react";
import { taskApi } from "../../services/api";

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
        const fetchReportData = async () => {
            try {
                const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
                const role = loggedInUser.role || "employee";

                let response;
                let tasks = [];

                if (role === "superadmin") {
                    response = await taskApi.getSuperAdminTasks();
                    if (response && response.success) {
                        tasks = response.assignedTasks || [];
                    }
                } else if (role === "admin") {
                    response = await taskApi.getAdminTasks();
                    if (response && response.success) {
                        tasks = response.assignedTasks || [];
                    }
                } else {
                    response = await taskApi.getMyTasks();
                    if (response && response.success) {
                        tasks = response.tasks || [];
                    }
                }

                setTaskList(tasks);

                setReportData({
                    totalTasks: tasks.length,
                    completedTasks: tasks.filter(t => (t.status || "").toLowerCase() === "completed").length,
                    pendingTasks: tasks.filter(t => (t.status || "").toLowerCase() === "pending").length,
                    inProgressTasks: tasks.filter(t => (t.status || "").toLowerCase() === "in progress").length
                });
            } catch (error) {
                console.error("Failed to load reports data:", error);
            }
        };

        fetchReportData();
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

            {/* Task Progress & Assignment History Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">







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