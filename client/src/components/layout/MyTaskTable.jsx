import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { X, Calendar, FileText, User } from "lucide-react";

function MyTaskTable({ color }) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchFilter = queryParams.get("search") || "";

    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchMyTasks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/employee/my-tasks`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data && response.data.success) {
                setTaskList(response.data.tasks);
            }
        } catch (error) {
            console.error("Fetch My Tasks Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const filteredTasks = taskList.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchFilter.toLowerCase());
        const matchesStatus = statusFilter === "All" || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        if (status === "Completed") return "bg-green-100 text-green-700";
        if (status === "In Progress") return "bg-blue-100 text-blue-700";
        return "bg-amber-100 text-amber-700";
    };

    const getPriorityColor = (priority) => {
        const p = (priority || "").toLowerCase();
        if (p === "high" || p === "urgent") return "text-red-600 bg-red-50";
        if (p === "medium") return "text-orange-600 bg-orange-50";
        return "text-green-600 bg-green-50";
    };

    const handleUpdateStatus = (originalIndex) => {
        const taskToUpdate = filteredTasks[originalIndex];

        Swal.fire({
            title: "Update Task Status",
            html: `
                <div style="text-align: left;">
                    <label style="display: block; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 6px; tracking-wide">Select Status</label>
                    <select id="swal-status" class="swal2-input" style="width: 100%; height: 45px; margin: 0 0 16px 0; box-sizing: border-box; font-size: 14px; border-radius: 12px; border: 1px solid #e2e8f0;">
                        <option value="Pending" ${taskToUpdate.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="In Progress" ${taskToUpdate.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option value="Completed" ${taskToUpdate.status === "Completed" ? "selected" : ""}>Completed</option>
                    </select>
                    
                    <label style="display: block; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 6px; tracking-wide">Comment / Notes</label>
                    <textarea id="swal-comment" class="swal2-textarea" style="width: 100%; height: 80px; margin: 0; box-sizing: border-box; font-size: 14px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 10px;" placeholder="Add status comment or update notes...">${taskToUpdate.comment || ""}</textarea>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Select",
            confirmButtonColor: color === "purple" ? "#9333ea" : color === "blue" ? "#2563eb" : "#10b981",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const status = document.getElementById("swal-status").value;
                const comment = document.getElementById("swal-comment").value;
                return { status, comment };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const { status: selectedStatus, comment: enteredComment } = result.value;

                Swal.fire({
                    title: "Confirm Status Change",
                    text: `Are you sure you want to change the status of this task to "${selectedStatus}"?`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Update",
                    cancelButtonText: "No, Cancel",
                    confirmButtonColor: color === "purple" ? "#9333ea" : color === "blue" ? "#2563eb" : "#10b981",
                }).then(async (confirmResult) => {
                    if (confirmResult.isConfirmed) {
                        try {
                            const token = localStorage.getItem("token");
                            const response = await axios.patch(
                                `${import.meta.env.VITE_BACKEND_URL}/api/employee/update-status/${taskToUpdate._id}`,
                                { status: selectedStatus, comment: enteredComment },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            );

                            if (response.data && response.data.success) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Status Updated",
                                    text: `Task status updated to ${selectedStatus}`,
                                    timer: 1500,
                                    showConfirmButton: false
                                });
                                fetchMyTasks();
                            }
                        } catch (error) {
                            console.error("Update Task Status Error:", error);
                            Swal.fire({
                                icon: "error",
                                title: "Update Failed",
                                text: "Something went wrong while updating task status."
                            });
                        }
                    }
                });
            }
        });
    };

    if (loading) {
        return (
            <div className="p-4 lg:p-8 max-w-7xl mx-auto flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }




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
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${color === "purple"
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

                {/* Filter Tabs */}
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex overflow-x-auto gap-2 pb-3 md:pb-4 max-w-full scrollbar-none">
                    <style>{`
                        .scrollbar-none::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-none {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                    {[
                        { label: "All Tasks", value: "All" },
                        { label: "Pending Tasks", value: "Pending" },
                        { label: "In Progress Tasks", value: "In Progress" },
                        { label: "Complete Tasks", value: "Completed" }
                    ].map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setStatusFilter(tab.value)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 shadow-md ${statusFilter === tab.value
                                ? "bg-emerald-600 text-white shadow-emerald-200 scale-[1.02] border border-emerald-600"
                                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80 hover:shadow-lg"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    {filteredTasks.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 font-medium">No tasks assigned to you.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Sl.No</th>
                                    <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Task Title</th>
                                    <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Priority</th>
                                    <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Due Date</th>
                                    <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 text-center">Status</th>
                                    <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map((task, index) => (
                                    <tr key={index} className="hover:bg-slate-50/80 transition border-b border-slate-50 last:border-none">
                                        <td onClick={() => setSelectedTask(task)} className="py-4 px-6 text-sm text-slate-500 font-medium cursor-pointer">
                                            {index + 1}
                                        </td>
                                        <td onClick={() => setSelectedTask(task)} className="py-4 px-6 text-sm text-slate-800 cursor-pointer">
                                            <div className="font-bold hover:text-emerald-600 transition">{task.title}</div>
                                            {task.comment && (
                                                <div className="text-[11px] font-medium text-slate-400 mt-1 italic">
                                                    Comment: {task.comment}
                                                </div>
                                            )}
                                            {(task.updatedAt || task.lastUpdated) && (
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                    Updated: {task.updatedAt ? new Date(task.updatedAt).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : task.lastUpdated}
                                                </div>
                                            )}
                                        </td>
                                        <td onClick={() => setSelectedTask(task)} className="py-4 px-6 text-sm cursor-pointer">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td onClick={() => setSelectedTask(task)} className="py-4 px-6 text-sm font-medium text-slate-600 cursor-pointer">
                                            {new Date(task.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td onClick={() => setSelectedTask(task)} className="py-4 px-6 text-center cursor-pointer">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleUpdateStatus(index)}
                                                className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition ${color === "purple"
                                                    ? "bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200"
                                                    : color === "blue"
                                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                                                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200"
                                                    }`}
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden flex flex-col gap-4 p-4 bg-slate-50/50">
                    {filteredTasks.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-100">No tasks assigned to you.</div>
                    ) : (
                        filteredTasks.map((task, index) => (
                            <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative">
                                <div className="flex justify-between items-start mb-1" onClick={() => setSelectedTask(task)}>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Task #{index + 1}</span>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </div>

                                <div onClick={() => setSelectedTask(task)} className="cursor-pointer">
                                    <h3 className="text-base font-bold text-slate-800 leading-tight hover:text-emerald-600 transition">{task.title}</h3>
                                    {task.comment && (
                                        <p className="text-[11px] font-medium text-slate-400 mt-1 italic">
                                            Comment: {task.comment}
                                        </p>
                                    )}
                                    {(task.updatedAt || task.lastUpdated) && (
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                            Updated: {task.updatedAt ? new Date(task.updatedAt).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : task.lastUpdated}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-500 mt-1.5 font-medium">Due: {new Date(task.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>

                                <div className="mt-3 flex justify-between items-center border-t border-slate-100 pt-4">
                                    <span className="text-xs text-slate-500 font-medium">Status</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateStatus(index)}
                                            className={`px-2.5 py-1 border rounded-lg text-[10px] font-bold transition ${color === "purple"
                                                ? "bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-100"
                                                : color === "blue"
                                                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100"
                                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100"
                                                }`}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Task View Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] md:max-h-[85vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 border-t-4 border-t-emerald-600">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200/50 font-bold">
                                    Task Details
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedTask.status)}`}>
                                    {selectedTask.status}
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
                        <div className="p-6 flex flex-col gap-5 overflow-y-auto">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Task Title</span>
                                <h3 className="text-lg font-bold text-slate-800 leading-snug">{selectedTask.title}</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Priority</span>
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedTask.priority)}`}>
                                        {selectedTask.priority}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Task Type</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                                        {selectedTask.taskType ? selectedTask.taskType.replace('_', ' ') : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {selectedTask.department && (
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Department</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                                        {selectedTask.department}
                                    </span>
                                </div>
                            )}

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Assigned By</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex justify-center items-center font-bold text-xs">
                                        {selectedTask.assignedBy?.name?.charAt(0) || "A"}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-700">{selectedTask.assignedBy?.name || "Admin"}</p>
                                        <p className="text-[10px] text-slate-400">{selectedTask.assignedBy?.email || ""}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Description</span>
                                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mt-1 whitespace-pre-wrap">
                                    {selectedTask.description || "No description provided."}
                                </p>
                            </div>

                            {selectedTask.comment && (
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Last Comment / Status Updates</span>
                                    <p className="text-xs text-slate-500 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 mt-1">
                                        "{selectedTask.comment}"
                                    </p>
                                </div>
                            )}

                            {/* Dates Grid */}
                            <div className="grid grid-cols-2 gap-4">
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
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Due Date</span>
                                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {new Date(selectedTask.dueDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Attachments */}
                            {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Attachments</span>
                                    <div className="flex flex-col gap-1.5 mt-1">
                                        {selectedTask.attachments.map((file, fIdx) => (
                                            <a
                                                key={fIdx}
                                                href={`${import.meta.env.VITE_BACKEND_URL}${file.fileUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition text-xs font-bold text-slate-700"
                                            >
                                                <FileText className="w-4 h-4 text-emerald-600" />
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
                                onClick={() => setSelectedTask(null)}
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

export default MyTaskTable;