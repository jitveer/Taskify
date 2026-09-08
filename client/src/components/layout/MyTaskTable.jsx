import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import customSwal, { showSuccess, showError, showConfirm } from "../../components/layout/alerts";
import { taskApi } from "../../services/api";
import { X, Calendar, FileText } from "lucide-react";

function MyTaskTable({ color }) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchFilter = queryParams.get("search") || "";
    const statusParam = queryParams.get("status") || "All";

    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(statusParam);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentStatus = queryParams.get("status");
        if (currentStatus) {
            setStatusFilter(currentStatus);
        }
    }, [location.search]);

    const fetchMyTasks = async () => {
        try {
            setLoading(true);
            const response = await taskApi.getMyTasks();
            if (response && response.success) {
                // Map flat legacy response objects into standard schema representations
                const normalizedTasks = (response.tasks || []).map(t => ({
                    ...t,
                    // If backend is flat, normalize fields locally
                    assignmentId: t.assignmentId,
                    status: t.status,
                    completedAt: t.completedAt
                }));
                setTaskList(normalizedTasks);

                // If arriving from notification with searchFilter (task title), auto open task details and set Pending tab if applicable
                const searchQ = new URLSearchParams(window.location.search).get("search");
                if (searchQ) {
                    const matched = normalizedTasks.find(t => t.title.toLowerCase().trim() === searchQ.toLowerCase().trim());
                    if (matched) {
                        setSelectedTask(matched);
                        // If specific status param wasn't specified, switch to matched task's status tab
                        const explicitStatus = new URLSearchParams(window.location.search).get("status");
                        if (!explicitStatus && matched.status) {
                            setStatusFilter(matched.status);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Fetch My Tasks Error:", error);
            showError(error.message || "Failed to load tasks.", "Error");
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
        if (status === "Rejected") return "bg-red-100 text-red-700";
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

        // Do not allow status changes if Completed
        if (taskToUpdate.status === "Completed") {
            showError("Completed tasks cannot be changed.", "Completed Task");
            return;
        }

        // Build list of valid transitions based on backend rules
        const transitionRules = {
            "Pending": [
                { label: "In Progress", value: "In Progress" },
                { label: "Rejected", value: "Rejected" }
            ],
            "In Progress": [
                { label: "In Progress (Add Work/Progress Report)", value: "In Progress" },
                { label: "Completed", value: "Completed" },
                { label: "Rejected", value: "Rejected" },
                { label: "Pending", value: "Pending" }
            ],
            "Rejected": [
                { label: "Pending", value: "Pending" },
                { label: "In Progress", value: "In Progress" }
            ],
            "Overdue": [
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" }
            ]
        };

        const progressCount = taskToUpdate.progressUpdates?.length || 0;
        const isLimitReached = progressCount >= 18;

        const availableOptions = transitionRules[taskToUpdate.status] || [];
        const btnColor = color === "purple" ? "#9333ea" : color === "blue" ? "#2563eb" : "#10b981";

        customSwal.fire({
            title: "Update Task Status",
            html: `
                <div class="text-left mt-3">
                    <div class="flex items-center justify-between mb-2">
                        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Select New Status</label>
                        <span class="text-[11px] font-bold ${progressCount >= 15 ? 'text-rose-500' : 'text-slate-400'}">
                            Progress Updates: ${progressCount}/18
                        </span>
                    </div>

                    <div class="relative mb-4">
                        <select id="swal-status" class="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition appearance-none cursor-pointer">
                            ${availableOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join("")}
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    
                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Comment / Progress Notes</label>
                    <textarea id="swal-comment" class="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-3.5 h-20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none mb-3" placeholder="Add progress report or notes..."></textarea>

                    <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Attach File / Report (Max 10MB)</label>
                    <div class="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 text-center hover:bg-slate-100 transition cursor-pointer relative">
                        <input type="file" id="swal-file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt" />
                        <div class="flex items-center justify-center gap-2 text-slate-600 text-xs font-semibold" id="swal-file-label">
                            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                            <span>Choose a file (Images, PDF, Excel, Docs, PPT)</span>
                        </div>
                    </div>
                    <div id="swal-file-name" class="text-[11px] text-emerald-600 font-bold mt-1.5 truncate"></div>
                </div>
            `,
            didOpen: () => {
                const fileInput = document.getElementById("swal-file");
                const fileNameDiv = document.getElementById("swal-file-name");
                if (fileInput) {
                    fileInput.addEventListener("change", (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                                customSwal.showValidationMessage("File size exceeds 10MB limit. Please select a smaller file.");
                                fileInput.value = "";
                                fileNameDiv.textContent = "";
                            } else {
                                customSwal.resetValidationMessage();
                                fileNameDiv.textContent = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
                            }
                        }
                    });
                }
            },
            showCancelButton: true,
            confirmButtonText: "Update Status",
            cancelButtonText: "Cancel",
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                htmlContainer: 'custom-swal-html',
                confirmButton: 'custom-swal-confirm',
                cancelButton: 'custom-swal-cancel',
                actions: 'custom-swal-actions'
            },
            preConfirm: () => {
                const status = document.getElementById("swal-status")?.value;
                const comment = document.getElementById("swal-comment")?.value;
                const fileInput = document.getElementById("swal-file");
                const file = fileInput?.files?.[0] || null;

                if (status === "In Progress" && isLimitReached) {
                    customSwal.showValidationMessage("Maximum limit of 18 progress updates has been reached for this task.");
                    return false;
                }

                if (file && file.size > 10 * 1024 * 1024) {
                    customSwal.showValidationMessage("File size cannot exceed 10MB.");
                    return false;
                }

                return { status, comment, file };
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                const { status: selectedStatus, comment: enteredComment, file: selectedFile } = result.value;

                const confirmResult = await showConfirm({
                    title: "Confirm Status Change",
                    text: `Are you sure you want to change the status of this task to "${selectedStatus}"?`,
                    confirmButtonText: "Yes, Update",
                    cancelButtonText: "No, Cancel",
                    icon: "question"
                });

                if (confirmResult.isConfirmed) {
                    try {
                        const formData = new FormData();
                        formData.append("status", selectedStatus);
                        if (enteredComment) formData.append("comment", enteredComment);
                        if (selectedFile) formData.append("attachment", selectedFile);

                        await taskApi.updateAssignmentStatus(
                            taskToUpdate.assignmentId,
                            formData
                        );

                        await showSuccess(`Task status updated to "${selectedStatus}"`, "Status Updated");
                        fetchMyTasks();
                    } catch (error) {
                        console.error("Update Task Status Error:", error);
                        showError(error.message || "Failed to update status transition.", "Update Failed");
                    }
                }
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
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100">

                {/* Filter Tabs - Sticky below navbar */}
                <div className="sticky top-[73px] z-30 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 rounded-t-3xl flex overflow-x-auto gap-2 pb-3 md:pb-4 max-w-full scrollbar-none shadow-xs">
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
                                            {task.status !== "Completed" && (
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
                                            )}
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

                                <div className="mt-3 flex justify-between items-center border-t border-slate-100">
                                    <span className="text-xs text-slate-500 font-medium">Status</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                        {task.status !== "Completed" && (
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
                                        )}
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
                                        <p className="text-[10px] text-slate-400">
                                            {selectedTask.assignedBy
                                                ? `${selectedTask.assignedBy.department?.toUpperCase() || ""} | ${selectedTask.assignedBy.role === 'superadmin' ? 'Super Admin' : selectedTask.assignedBy.role === 'admin' ? 'Admin' : 'Employee'}`
                                                : ""}
                                        </p>
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

                            {/* Progress Updates Timeline (Work Logs) */}
                            {selectedTask.progressUpdates && selectedTask.progressUpdates.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                            Work Progress History ({selectedTask.progressUpdates.length}/18)
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
                                        {selectedTask.progressUpdates.map((update, uIdx) => (
                                            <div key={uIdx} className="bg-slate-50 border border-slate-200/70 p-3 rounded-2xl flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(update.status)}`}>
                                                        {update.status}
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
                                                    <p className="text-xs text-slate-700 leading-snug font-medium">
                                                        {update.comment}
                                                    </p>
                                                )}
                                                {update.attachment && update.attachment.fileUrl && (
                                                    <a
                                                        href={`${import.meta.env.VITE_BACKEND_URL}${update.attachment.fileUrl}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-1 flex items-center gap-2 p-2 bg-white hover:bg-emerald-50/50 border border-slate-200 rounded-xl transition text-xs font-semibold text-emerald-700 group"
                                                    >
                                                        <FileText className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
                                                        <span className="truncate flex-1">{update.attachment.fileName || "View Attachment"}</span>
                                                        {update.attachment.fileSize && (
                                                            <span className="text-[10px] text-slate-400 font-normal">
                                                                ({(update.attachment.fileSize / (1024 * 1024)).toFixed(2)} MB)
                                                            </span>
                                                        )}
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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