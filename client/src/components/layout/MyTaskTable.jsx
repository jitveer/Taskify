import { useLocation, useNavigate } from "react-router-dom";

function MyTaskTable({ color }) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchFilter = queryParams.get("search") || "";

    const tasks = [
        { title: "UI Dashboard Design", priority: "High", dueDate: "20 May 2026", status: "Pending" },
        { title: "Backend API Integration", priority: "Medium", dueDate: "22 May 2026", status: "In Progress" },
        { title: "Attendance Module", priority: "Low", dueDate: "25 May 2026", status: "Completed" }
    ];

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const getStatusColor = (status) => {
        if (status === "Completed") return "bg-green-100 text-green-700";
        if (status === "In Progress") return "bg-blue-100 text-blue-700";
        return "bg-amber-100 text-amber-700";
    };

    const getPriorityColor = (priority) => {
        if (priority === "High") return "text-red-600 bg-red-50";
        if (priority === "Medium") return "text-orange-600 bg-orange-50";
        return "text-green-600 bg-green-50";
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Header Section */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">My Tasks</h2>
                        <p className="text-sm text-slate-500 mt-1">Review your assigned tasks and deadlines.</p>
                    </div>
                    {searchFilter && (
                        <div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                                color === "purple" 
                                ? "bg-purple-50 text-purple-700 border-purple-100" 
                                : color === "blue"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}>
                                Filtered by notification: "{searchFilter}"
                                <button
                                    onClick={() => navigate(location.pathname)}
                                    className="hover:scale-110 ml-1.5 font-bold"
                                >
                                    ✕
                                </button>
                            </span>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Sl.No</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Task Title</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Priority</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Due Date</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((task, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition border-b border-slate-50 last:border-none">
                                    <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-slate-800">
                                        {task.title}
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-slate-600">
                                        {task.dueDate}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden flex flex-col gap-4 p-4 bg-slate-50/50">
                    {filteredTasks.map((task, index) => (
                        <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Task #{index + 1}</span>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-slate-800 leading-tight">{task.title}</h3>
                                <p className="text-xs text-slate-500 mt-1.5 font-medium">Due: {task.dueDate}</p>
                            </div>

                            <div className="mt-3 flex justify-between items-center border-t border-slate-100 pt-4">
                                <span className="text-xs text-slate-500 font-medium">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyTaskTable;