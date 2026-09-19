import {
    Search, Eye, X, Filter, Calendar, FileText, ChevronDown, ChevronUp,
    User, FileCheck, ClipboardList, Clock, Users, CheckCircle2, AlertCircle,
    RotateCcw, TrendingUp, Sparkles, ArrowUpDown, SlidersHorizontal, Paperclip
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import customSwal, { showSuccess, showError, showConfirm } from "../../components/layout/alerts";
import { taskApi } from "../../services/api";
import { formatTime12Hour } from "../../utils/timeFormatter";
import { openSecureFile } from "../../utils/fileUrl";


function TaskStatusTable({ color, apiPrefix }) {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [taskTypeFilter, setTaskTypeFilter] = useState("All"); // "All" | "group_task" | "individual"
    const [assigneeFilter, setAssigneeFilter] = useState("All"); // "All" | assigneeId
    const [dateBasis, setDateBasis] = useState("due"); // "due" | "assigned"
    const [datePreset, setDatePreset] = useState("all"); // "all" | "today" | "yesterday" | "last7days" | "last30days" | "thisMonth" | "custom"
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModalTab, setActiveModalTab] = useState("overview"); // "overview" | "reports"
    const [selectedAssigneeId, setSelectedAssigneeId] = useState(null);

    const chipsScrollRef = useRef(null);
    const [isDraggingChips, setIsDraggingChips] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragScrollLeft, setDragScrollLeft] = useState(0);
    const hasDraggedRef = useRef(false);

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = currentUser._id || currentUser.id || "";
    const currentUserRole = (currentUser.role || "").toLowerCase();

    // Fetch tasks from API
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
                mappedTasks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                setTasks(mappedTasks);
                setSelectedTask(prev => {
                    if (!prev) return null;
                    const updated = mappedTasks.find(t => (t._id || t.taskId)?.toString() === (prev._id || prev.taskId)?.toString());
                    return updated || prev;
                });
            }
        } catch (error) {
            console.error("Task List Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [apiPrefix]);

    const handleUpdateTaskStatus = (task, assignmentToUpdate) => {
        if (!assignmentToUpdate) return;

        // Do not allow status changes if Completed
        if (assignmentToUpdate.status === "Completed") {
            showError("Completed tasks cannot be changed.", "Completed Task");
            return;
        }

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

        const progressCount = assignmentToUpdate.progressUpdates?.length || 0;
        const isLimitReached = progressCount >= 18;
        const availableOptions = transitionRules[assignmentToUpdate.status] || [];

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
                    <textarea id="swal-comment" maxlength="5000" class="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-3.5 h-20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none mb-3" placeholder="Add progress report or notes (max 5000 chars)..."></textarea>

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

                        const targetAssignmentId = assignmentToUpdate.assignmentId || assignmentToUpdate._id;
                        await taskApi.updateAssignmentStatus(
                            targetAssignmentId,
                            formData
                        );

                        await showSuccess(`Task status updated to "${selectedStatus}"`, "Status Updated");
                        fetchTasks();
                    } catch (error) {
                        console.error("Update Task Status Error:", error);
                        showError(error.message || "Failed to update status transition.", "Update Failed");
                    }
                }
            }
        });
    };

    // Handle URL search / filter params
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const filterParam = queryParams.get("filter");
        const searchParam = queryParams.get("search");

        if (filterParam) {
            setStatusFilter(filterParam);
        }

        if (searchParam) {
            setSearchQuery(searchParam);

            if (tasks.length > 0) {
                const matchedTask = tasks.find(t =>
                    (t.title || "").toLowerCase() === searchParam.toLowerCase()
                );
                if (matchedTask) {
                    setSelectedTask(matchedTask);
                }
            }
        }
    }, [location.search, tasks]);

    // Extract all unique assignees across all tasks
    const allAssignees = useMemo(() => {
        const map = new Map();
        tasks.forEach(t => {
            t.assignments?.forEach(a => {
                if (a.assignee && a.assignee._id) {
                    const id = a.assignee._id.toString();
                    if (!map.has(id)) {
                        map.set(id, {
                            _id: id,
                            name: a.assignee.name || "Unknown",
                            department: a.assignee.department || t.department || "",
                            role: a.assignee.role || "employee",
                            user_id: a.assignee.user_id || ""
                        });
                    }
                }
            });
        });
        return Array.from(map.values()).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }, [tasks]);

    // Handle Date Presets
    const handleDatePresetChange = (preset) => {
        setDatePreset(preset);
        const today = new Date();
        const formatDate = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        if (preset === "all") {
            setStartDate("");
            setEndDate("");
        } else if (preset === "today") {
            const todayStr = formatDate(today);
            setStartDate(todayStr);
            setEndDate(todayStr);
        } else if (preset === "yesterday") {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const yesterdayStr = formatDate(yesterday);
            setStartDate(yesterdayStr);
            setEndDate(yesterdayStr);
        } else if (preset === "last7days") {
            const past7 = new Date(today);
            past7.setDate(today.getDate() - 6);
            setStartDate(formatDate(past7));
            setEndDate(formatDate(today));
        } else if (preset === "last30days") {
            const past30 = new Date(today);
            past30.setDate(today.getDate() - 29);
            setStartDate(formatDate(past30));
            setEndDate(formatDate(today));
        } else if (preset === "thisMonth") {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            setStartDate(formatDate(firstDay));
            setEndDate(formatDate(lastDay));
        }
    };

    // Reset All Filters
    const resetAllFilters = () => {
        setSearchQuery("");
        setStatusFilter("All");
        setTaskTypeFilter("All");
        setAssigneeFilter("All");
        setDatePreset("all");
        setStartDate("");
        setEndDate("");
        setDateBasis("due");
    };

    const hasActiveFilters = searchQuery !== "" || statusFilter !== "All" || taskTypeFilter !== "All" || assigneeFilter !== "All" || datePreset !== "all" || startDate !== "" || endDate !== "";

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchQuery) count++;
        if (statusFilter !== "All") count++;
        if (taskTypeFilter !== "All") count++;
        if (assigneeFilter !== "All") count++;
        if (datePreset !== "all" || startDate || endDate) count++;
        return count;
    }, [searchQuery, statusFilter, taskTypeFilter, assigneeFilter, datePreset, startDate, endDate]);

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

    const activeColor = colorClasses[color] || colorClasses.purple;

    // Base filtered tasks without status filter (used for top metric cards and status counts)
    const baseFilteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            // 1. Search Query
            const q = searchQuery.toLowerCase().trim();
            let matchesSearch = true;
            if (q) {
                const titleMatch = (task.title || "").toLowerCase().includes(q);
                const descMatch = (task.description || "").toLowerCase().includes(q);
                const deptMatch = (task.department || "").toLowerCase().includes(q);
                const assigneeMatch = task.assignments?.some(a => (a.assignee?.name || "").toLowerCase().includes(q) || (a.assignee?.user_id || "").toLowerCase().includes(q));
                matchesSearch = titleMatch || descMatch || deptMatch || assigneeMatch;
            }

            // 2. Task Type Filter (Group vs Individual)
            let matchesType = true;
            if (taskTypeFilter === "group_task") {
                matchesType = task.taskType === "group_task";
            } else if (taskTypeFilter === "individual") {
                matchesType = task.taskType === "individual" || task.taskType === "individual_task";
            }

            // 3. Assignee / Person Filter
            let matchesAssignee = true;
            if (assigneeFilter !== "All") {
                matchesAssignee = task.assignments?.some(a => (a.assignee?._id || a.assignee)?.toString() === assigneeFilter);
            }

            // 4. Date-wise Calendar Filter
            let matchesDate = true;
            if (startDate || endDate) {
                const rawDate = dateBasis === "due"
                    ? task.dueDate
                    : (task.createdAt || task.assignedAt);

                if (!rawDate) {
                    matchesDate = false;
                } else {
                    const taskDateObj = new Date(rawDate);
                    const taskDateStr = taskDateObj.toISOString().split("T")[0];

                    if (startDate && taskDateStr < startDate) {
                        matchesDate = false;
                    }
                    if (endDate && taskDateStr > endDate) {
                        matchesDate = false;
                    }
                }
            }

            return matchesSearch && matchesType && matchesAssignee && matchesDate;
        });
    }, [tasks, searchQuery, taskTypeFilter, assigneeFilter, dateBasis, startDate, endDate]);

    // Filter tasks based on all criteria including status filter (for table rows)
    const filteredTasks = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        return baseFilteredTasks.filter((task) => {
            if (statusFilter === "All") return true;

            if (statusFilter.toLowerCase() === "overdue") {
                if (assigneeFilter !== "All") {
                    const userAssign = task.assignments?.find(a => (a.assignee?._id || a.assignee)?.toString() === assigneeFilter);
                    const isCompleted = (userAssign?.status || "").toLowerCase() === "completed";
                    return !isCompleted && task.dueDate && new Date(task.dueDate) < now;
                } else {
                    const isCompleted = task.assignments?.length > 0 && task.assignments.every(a => (a.status || "").toLowerCase() === "completed");
                    return !isCompleted && task.dueDate && new Date(task.dueDate) < now;
                }
            }

            if (assigneeFilter !== "All") {
                // Check status for that specific assignee
                const userAssign = task.assignments?.find(a => (a.assignee?._id || a.assignee)?.toString() === assigneeFilter);
                return userAssign ? (userAssign.status || "").toLowerCase() === statusFilter.toLowerCase() : false;
            } else {
                const hasStatus = task.assignments?.some(a => (a.status || "").toLowerCase() === statusFilter.toLowerCase()) || (task.status || "").toLowerCase() === statusFilter.toLowerCase();
                return hasStatus;
            }
        }).sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return timeB - timeA;
        });
    }, [baseFilteredTasks, statusFilter, assigneeFilter]);

    // Selected Assignee Info
    const selectedAssigneeData = useMemo(() => {
        if (assigneeFilter === "All") return null;
        return allAssignees.find(a => a._id === assigneeFilter) || null;
    }, [assigneeFilter, allAssignees]);

    // Performance Analytics (Work Overview in selected date range / for selected person)
    const analytics = useMemo(() => {
        let total = 0;
        let completed = 0;
        let inProgress = 0;
        let pending = 0;
        let overdue = 0;

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        baseFilteredTasks.forEach(t => {
            if (assigneeFilter !== "All") {
                const a = t.assignments?.find(asg => (asg.assignee?._id || asg.assignee)?.toString() === assigneeFilter);
                if (a) {
                    total++;
                    const st = (a.status || "").toLowerCase();
                    if (st === "completed") {
                        completed++;
                    } else {
                        if (st === "in progress") inProgress++;
                        else pending++;

                        // Overdue calculation
                        if (t.dueDate) {
                            const dDate = new Date(t.dueDate);
                            dDate.setHours(0, 0, 0, 0);
                            if (dDate < now) overdue++;
                        }
                    }
                }
            } else {
                total++;
                const isCompleted = t.assignments?.length > 0 && t.assignments.every(a => (a.status || "").toLowerCase() === "completed");
                const hasInProgress = t.assignments?.some(a => (a.status || "").toLowerCase() === "in progress");

                if (isCompleted) {
                    completed++;
                } else if (hasInProgress) {
                    inProgress++;
                } else {
                    pending++;
                }

                if (!isCompleted && t.dueDate) {
                    const dDate = new Date(t.dueDate);
                    dDate.setHours(0, 0, 0, 0);
                    if (dDate < now) overdue++;
                }
            }
        });

        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            inProgress,
            pending,
            overdue,
            rate
        };
    }, [baseFilteredTasks, assigneeFilter]);

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8 space-y-6">
            {/* Metrics & Performance Overview Cards */}
            <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                {/* Total Tasks */}
                <div
                    onClick={() => setStatusFilter("All")}
                    className={`min-w-[130px] sm:min-w-0 flex-1 relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between group shrink-0 ${statusFilter === "All"
                        ? "border-slate-800 shadow-xs ring-2 ring-slate-800/10"
                        : "border-slate-100 hover:border-slate-300 hover:shadow-xs"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-slate-100 group-hover:bg-slate-800 group-hover:text-white text-slate-600 transition-colors flex items-center justify-center">
                            <ClipboardList className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                    </div>
                    <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                        <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{analytics.total}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded">all</span>
                    </div>
                </div>

                {/* Completed */}
                <div
                    onClick={() => setStatusFilter(statusFilter === "Completed" ? "All" : "Completed")}
                    className={`min-w-[130px] sm:min-w-0 flex-1 relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between group shrink-0 ${statusFilter === "Completed"
                        ? "border-emerald-500 shadow-xs ring-2 ring-emerald-500/20 bg-emerald-50/20"
                        : "border-slate-100 hover:border-emerald-200 hover:shadow-xs"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Done</span>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 transition-colors flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                    </div>
                    <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                        <span className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">{analytics.completed}</span>
                        <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-full">
                            {analytics.rate}%
                        </span>
                    </div>
                </div>

                {/* In Progress */}
                <div
                    onClick={() => setStatusFilter(statusFilter === "In Progress" ? "All" : "In Progress")}
                    className={`min-w-[130px] sm:min-w-0 flex-1 relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between group shrink-0 ${statusFilter === "In Progress"
                        ? "border-blue-500 shadow-xs ring-2 ring-blue-500/20 bg-blue-50/20"
                        : "border-slate-100 hover:border-blue-200 hover:shadow-xs"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider">Progress</span>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors flex items-center justify-center">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                    </div>
                    <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                        <span className="text-xl sm:text-2xl font-black text-blue-700 tracking-tight">{analytics.inProgress}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">active</span>
                    </div>
                </div>

                {/* Pending */}
                <div
                    onClick={() => setStatusFilter(statusFilter === "Pending" ? "All" : "Pending")}
                    className={`min-w-[130px] sm:min-w-0 flex-1 relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between group shrink-0 ${statusFilter === "Pending"
                        ? "border-amber-500 shadow-xs ring-2 ring-amber-500/20 bg-amber-50/20"
                        : "border-slate-100 hover:border-amber-200 hover:shadow-xs"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending</span>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-amber-50 group-hover:bg-amber-600 group-hover:text-white text-amber-600 transition-colors flex items-center justify-center">
                            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                    </div>
                    <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                        <span className="text-xl sm:text-2xl font-black text-amber-700 tracking-tight">{analytics.pending}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">waiting</span>
                    </div>
                </div>

                {/* Overdue */}
                <div
                    onClick={() => setStatusFilter(statusFilter === "Overdue" ? "All" : "Overdue")}
                    className={`min-w-[130px] sm:min-w-0 flex-1 relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between group shrink-0 ${statusFilter === "Overdue"
                        ? "border-red-500 shadow-xs ring-2 ring-red-500/20 bg-red-50/20"
                        : "border-slate-100 hover:border-red-200 hover:shadow-xs"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-bold text-red-600 uppercase tracking-wider">Overdue</span>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-red-50 group-hover:bg-red-600 group-hover:text-white text-red-600 transition-colors flex items-center justify-center">
                            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                    </div>
                    <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
                        <span className="text-xl sm:text-2xl font-black text-red-700 tracking-tight">{analytics.overdue}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">delayed</span>
                    </div>
                </div>
            </div>

            {/* Responsive Search & Filters Bar */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-slate-100 p-3.5 sm:p-5">
                {/* Mobile / Tablet Header: Search + Filter Trigger Button */}
                <div className="flex lg:hidden items-center gap-2">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search tasks, dept, member..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition font-medium text-slate-800 placeholder-slate-400`}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Button with Badge */}
                    <button
                        type="button"
                        onClick={() => setIsMobileFilterOpen(true)}
                        className={`relative flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${activeFilterCount > 0
                            ? `${activeColor.accentBg} text-white border-transparent shadow-xs`
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline">Filters</span>
                        {activeFilterCount > 0 && (
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${activeFilterCount > 0 ? "bg-white text-slate-900" : "bg-purple-600 text-white"
                                }`}>
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Quick Reset Button if active */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={resetAllFilters}
                            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/70 transition cursor-pointer shrink-0"
                            title="Reset all filters"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Mobile Active Filter Chips (Quick removal on mobile) */}
                {hasActiveFilters && (
                    <div className="flex lg:hidden flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Active:</span>
                        {statusFilter !== "All" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60 text-[11px] font-bold">
                                Status: {statusFilter}
                                <button onClick={() => setStatusFilter("All")} className="hover:opacity-75"><X className="w-3 h-3" /></button>
                            </span>
                        )}
                        {taskTypeFilter !== "All" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200/60 text-[11px] font-bold">
                                Type: {taskTypeFilter === "group_task" ? "Group" : "Individual"}
                                <button onClick={() => setTaskTypeFilter("All")} className="hover:opacity-75"><X className="w-3 h-3" /></button>
                            </span>
                        )}
                        {assigneeFilter !== "All" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold">
                                Member: {allAssignees.find(a => a._id === assigneeFilter)?.name || "1 Member"}
                                <button onClick={() => setAssigneeFilter("All")} className="hover:opacity-75"><X className="w-3 h-3" /></button>
                            </span>
                        )}
                        {datePreset !== "all" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 text-[11px] font-bold">
                                Date: {datePreset === "custom" ? `${startDate || '...'} to ${endDate || '...'}` : datePreset}
                                <button onClick={() => { setDatePreset("all"); setStartDate(""); setEndDate(""); }} className="hover:opacity-75"><X className="w-3 h-3" /></button>
                            </span>
                        )}
                    </div>
                )}

                {/* Desktop Unified Filter Controls (Hidden on mobile/tablet) */}
                <div className="hidden lg:block space-y-3.5">
                    {/* Main Filter Controls Grid */}
                    <div className="grid grid-cols-12 gap-2.5 items-center">
                        {/* Search Input (4 Cols) */}
                        <div className="col-span-4 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search tasks, dept, or member..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition font-medium text-slate-800 placeholder-slate-400`}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Task Type Filter (2 Cols) */}
                        <div className="col-span-2 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <Users className="w-3.5 h-3.5" />
                            </span>
                            <select
                                value={taskTypeFilter}
                                onChange={(e) => setTaskTypeFilter(e.target.value)}
                                className={`w-full pl-8 pr-7 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition appearance-none cursor-pointer font-bold text-slate-700`}
                            >
                                <option value="All">All Types</option>
                                <option value="group_task">👥 Group</option>
                                <option value="individual">👤 Individual</option>
                            </select>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                                <ChevronDown className="w-3.5 h-3.5" />
                            </span>
                        </div>

                        {/* Member / Person Filter (3 Cols) */}
                        <div className="col-span-3 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <User className="w-3.5 h-3.5" />
                            </span>
                            <select
                                value={assigneeFilter}
                                onChange={(e) => setAssigneeFilter(e.target.value)}
                                className={`w-full pl-8 pr-7 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition appearance-none cursor-pointer font-bold text-slate-700 truncate`}
                            >
                                <option value="All">All Members ({allAssignees.length})</option>
                                {allAssignees.map(member => (
                                    <option key={member._id} value={member._id}>
                                        {member.name} {member.department ? `(${member.department})` : ""}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                                <ChevronDown className="w-3.5 h-3.5" />
                            </span>
                        </div>

                        {/* Status Filter (3 Cols) */}
                        <div className="col-span-3 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <Filter className="w-3.5 h-3.5" />
                            </span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`w-full pl-8 pr-7 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition appearance-none cursor-pointer font-bold text-slate-700`}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                                <ChevronDown className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </div>

                    {/* Sub-bar: Compact Date Presets & Custom Pickers */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                        {/* Date Quick Presets */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date:
                            </span>
                            {[
                                { id: "all", label: "All Time" },
                                { id: "today", label: "Today" },
                                { id: "yesterday", label: "Yesterday" },
                                { id: "last7days", label: "7 Days" },
                                { id: "last30days", label: "30 Days" },
                                { id: "thisMonth", label: "This Month" },
                                { id: "custom", label: "Custom" }
                            ].map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => handleDatePresetChange(preset.id)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer border ${datePreset === preset.id
                                        ? `${activeColor.bg} ${activeColor.text} border-transparent shadow-2xs`
                                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80"
                                        }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        {/* Date Inputs & Basis Switcher */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {/* Basis Switcher */}
                            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-[11px] font-bold shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setDateBasis("due")}
                                    className={`px-2 py-1 rounded-md transition cursor-pointer ${dateBasis === "due" ? "bg-white text-slate-800 shadow-2xs" : "text-slate-500 hover:text-slate-800"}`}
                                >
                                    Due Date
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDateBasis("assigned")}
                                    className={`px-2 py-1 rounded-md transition cursor-pointer ${dateBasis === "assigned" ? "bg-white text-slate-800 shadow-2xs" : "text-slate-500 hover:text-slate-800"}`}
                                >
                                    Assign Date
                                </button>
                            </div>

                            {/* From Date */}
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1 text-xs">
                                <span className="text-slate-400 font-medium text-[11px]">From:</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setDatePreset("custom");
                                    }}
                                    className="bg-transparent focus:outline-none text-slate-700 font-semibold cursor-pointer text-xs"
                                />
                            </div>

                            {/* To Date */}
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1 text-xs">
                                <span className="text-slate-400 font-medium text-[11px]">To:</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setDatePreset("custom");
                                    }}
                                    className="bg-transparent focus:outline-none text-slate-700 font-semibold cursor-pointer text-xs"
                                />
                            </div>

                            {/* Reset Filters */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetAllFilters}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/70 transition cursor-pointer shrink-0"
                                    title="Reset all applied filters"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile / Tablet Filter Bottom Sheet / Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
                    <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-slideUp">
                        {/* Header */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-slate-200/70 flex items-center justify-center text-slate-700">
                                    <SlidersHorizontal className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm">Filter Tasks</h3>
                                    <p className="text-[11px] text-slate-400 font-medium">Refine task list by criteria</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-800 border border-slate-200/70 flex items-center justify-center cursor-pointer shadow-2xs"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[65vh]">
                            {/* Task Type Filter */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Task Type</span>
                                </label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { id: "All", label: "All" },
                                        { id: "group_task", label: "Group" },
                                        { id: "individual", label: "Individual" }
                                    ].map(item => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setTaskTypeFilter(item.id)}
                                            className={`py-2 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${taskTypeFilter === item.id
                                                ? `${activeColor.bg} ${activeColor.text} border-transparent shadow-2xs`
                                                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80"
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Status</span>
                                </label>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {[
                                        { id: "All", label: "All Statuses" },
                                        { id: "Pending", label: "Pending" },
                                        { id: "In Progress", label: "In Progress" },
                                        { id: "Completed", label: "Completed" }
                                    ].map(item => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setStatusFilter(item.id)}
                                            className={`py-2 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${statusFilter === item.id
                                                ? `${activeColor.bg} ${activeColor.text} border-transparent shadow-2xs`
                                                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80"
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Member / Assignee Filter */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Assigned Member</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={assigneeFilter}
                                        onChange={(e) => setAssigneeFilter(e.target.value)}
                                        className={`w-full pl-3 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${activeColor.ring} ${activeColor.focusBorder} transition appearance-none cursor-pointer font-bold text-slate-700`}
                                    >
                                        <option value="All">All Members ({allAssignees.length})</option>
                                        {allAssignees.map(member => (
                                            <option key={member._id} value={member._id}>
                                                {member.name} {member.department ? `(${member.department})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>

                            {/* Date Filter & Presets */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Date Range</span>
                                    </label>

                                    {/* Due vs Assign Toggle */}
                                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-[10px] font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setDateBasis("due")}
                                            className={`px-2 py-0.5 rounded-md transition cursor-pointer ${dateBasis === "due" ? "bg-white text-slate-800 shadow-2xs" : "text-slate-500"}`}
                                        >
                                            Due Date
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDateBasis("assigned")}
                                            className={`px-2 py-0.5 rounded-md transition cursor-pointer ${dateBasis === "assigned" ? "bg-white text-slate-800 shadow-2xs" : "text-slate-500"}`}
                                        >
                                            Assign Date
                                        </button>
                                    </div>
                                </div>

                                {/* Preset Pills */}
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { id: "all", label: "All Time" },
                                        { id: "today", label: "Today" },
                                        { id: "yesterday", label: "Yesterday" },
                                        { id: "last7days", label: "7 Days" },
                                        { id: "last30days", label: "30 Days" },
                                        { id: "thisMonth", label: "This Month" }
                                    ].map(preset => (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => handleDatePresetChange(preset.id)}
                                            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition border cursor-pointer ${datePreset === preset.id
                                                ? `${activeColor.bg} ${activeColor.text} border-transparent shadow-2xs`
                                                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80"
                                                }`}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Date Inputs */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">From Date</span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                setDatePreset("custom");
                                            }}
                                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">To Date</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => {
                                                setEndDate(e.target.value);
                                                setDatePreset("custom");
                                            }}
                                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center gap-2">
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetAllFilters}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/70 transition cursor-pointer flex items-center justify-center gap-1"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset All</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsMobileFilterOpen(false)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white ${activeColor.accentBg} hover:opacity-90 transition cursor-pointer shadow-xs`}
                            >
                                Apply Filters ({filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tasks List Container */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/70 border-b border-slate-100">
                            <tr>
                                <th className="py-3.5 px-5 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 whitespace-nowrap">#</th>
                                <th className="py-3.5 px-5 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 whitespace-nowrap">Task Title</th>
                                <th className="py-3.5 px-5 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 whitespace-nowrap">Type</th>
                                <th className="py-3.5 px-5 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 whitespace-nowrap">Assign Date</th>
                                <th className="py-3.5 px-5 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 whitespace-nowrap">Due Date & Time</th>
                                <th className="py-3.5 px-5 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 whitespace-nowrap">Assignees & Progress</th>
                                <th className="py-3.5 px-5 text-[11px] uppercase tracking-wider font-extrabold text-slate-400 text-center whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTasks.map((task, index) => {
                                const isGroup = task.taskType === "group_task";
                                return (
                                    <tr key={task._id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3.5 px-5 text-xs font-bold text-slate-400 whitespace-nowrap">
                                            {index + 1}
                                        </td>

                                        <td className="py-3.5 px-5 text-sm font-semibold text-slate-800 min-w-[220px]">
                                            <div className="flex flex-col">
                                                <span className="whitespace-nowrap font-bold text-slate-800 hover:text-purple-600 transition-colors">{task.title}</span>
                                                <span className="text-[11px] text-slate-400 font-medium mt-0.5 whitespace-nowrap">
                                                    Dept: <strong className="text-slate-600">{task.department || "General"}</strong>
                                                    {task.priority && ` • Priority: ${task.priority}`}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-5 text-xs font-semibold whitespace-nowrap">
                                            {isGroup ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-bold text-[11px]">
                                                    <Users className="w-3 h-3" /> Group
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60 font-bold text-[11px]">
                                                    <User className="w-3 h-3" /> Individual
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-5 text-xs font-medium text-slate-600 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>
                                                    {new Date(task.createdAt || task.assignedAt || Date.now()).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-5 text-xs font-medium text-slate-600 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span className="font-semibold text-slate-700">
                                                        {new Date(task.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold ml-5">
                                                    ⏰ {formatTime12Hour(task.dueTime)}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-5 text-sm">
                                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                                                {task.assignments && task.assignments.length > 0 ? (
                                                    task.assignments.map((assignment, aIdx) => {
                                                        const isHighlight = assigneeFilter !== "All" && (assignment.assignee?._id || assignment.assignee)?.toString() === assigneeFilter;
                                                        return (
                                                            <div
                                                                key={aIdx}
                                                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs ${isHighlight
                                                                    ? "bg-purple-50 border-purple-200 font-bold"
                                                                    : "bg-slate-50 border-slate-100"
                                                                    }`}
                                                            >
                                                                <span className="font-semibold text-slate-700 text-[11px]">
                                                                    {assignment.assignee?.name || "N/A"}
                                                                </span>
                                                                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${getStatusColor(assignment.status)}`}>
                                                                    {assignment.status}
                                                                </span>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">No assignments</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-5 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => setSelectedTask(task)}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-slate-500 ${activeColor.hoverText} ${activeColor.hoverBg} border border-slate-200/60 hover:border-slate-300 transition cursor-pointer shadow-2xs`}
                                                title="View Task Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-14 text-center text-slate-400 text-sm">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                                                <ClipboardList className="w-6 h-6" />
                                            </div>
                                            <p className="font-bold text-slate-700 text-sm">No tasks matching your current filter.</p>
                                            <p className="text-xs text-slate-400 max-w-sm">Try clearing filters or changing search keywords to view assigned tasks.</p>
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={resetAllFilters}
                                                    className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer shadow-xs flex items-center gap-1.5"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                    <span>Clear All Filters</span>
                                                </button>
                                            )}
                                        </div>
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
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-base leading-snug">{task.title}</h3>
                                        <p className="text-xs text-slate-400 font-medium mt-1">{task.department || "General"}</p>
                                    </div>
                                    {task.taskType === "group_task" ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-bold text-[10px] shrink-0">
                                            <Users className="w-2.5 h-2.5" /> Group
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60 font-bold text-[10px] shrink-0">
                                            <User className="w-2.5 h-2.5" /> Individual
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assignments</span>
                                    {task.assignments && task.assignments.length > 0 ? (
                                        task.assignments.map((assignment, aIdx) => {
                                            const isHighlight = assigneeFilter !== "All" && (assignment.assignee?._id || assignment.assignee)?.toString() === assigneeFilter;
                                            return (
                                                <div key={aIdx} className={`flex justify-between items-center p-2.5 rounded-xl border ${isHighlight ? "bg-purple-50 border-purple-200" : "bg-slate-50 border-slate-100"}`}>
                                                    <span className="text-xs font-semibold text-slate-700">{assignment.assignee?.name || "N/A"}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(assignment.status)}`}>
                                                        {assignment.status}
                                                    </span>
                                                </div>
                                            );
                                        })
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
                                        {new Date(task.dueDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })} ({formatTime12Hour(task.dueTime)})
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
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                                        Dept: {selectedTask.department}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${activeColor.badgeBg} ${activeColor.badgeText} border ${activeColor.badgeBorder} capitalize`}>
                                        Type: {selectedTask.taskType ? selectedTask.taskType.replace('_', ' ') : 'N/A'}
                                    </span>
                                    {selectedTask.assignedBy && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                            <span className="text-slate-400 font-medium">Assigned by:</span>
                                            <span className="font-bold">{selectedTask.assignedBy.name || (typeof selectedTask.assignedBy === 'string' ? selectedTask.assignedBy : 'Admin')}</span>
                                            {selectedTask.assignedBy.role && (
                                                <span className="text-[9px] uppercase px-1 py-0.2 bg-indigo-200/60 rounded text-indigo-800 font-bold">
                                                    {selectedTask.assignedBy.role}
                                                </span>
                                            )}
                                        </span>
                                    )}
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
                                            ⏰ {formatTime12Hour(selectedTask.dueTime)}
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
                                            [...selectedTask.assignments]
                                                .sort((a, b) => {
                                                    const getLatestUpdateTimestamp = (assignment) => {
                                                        const updates = assignment?.progressUpdates || [];
                                                        if (updates.length > 0) {
                                                            const lastUpdate = updates[updates.length - 1];
                                                            return new Date(lastUpdate.updatedAt || lastUpdate.createdAt || 0).getTime();
                                                        }
                                                        return new Date(assignment?.updatedAt || assignment?.assignedAt || 0).getTime();
                                                    };
                                                    return getLatestUpdateTimestamp(b) - getLatestUpdateTimestamp(a);
                                                })
                                                .map((assignment, aIdx) => (
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

                                {/* Task Attachments by Assigner */}
                                {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                                            Task Attachments ({selectedTask.attachments.length})
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            {selectedTask.attachments.map((file, fIdx) => (
                                                <button
                                                    key={fIdx}
                                                    type="button"
                                                    onClick={() => openSecureFile(file.fileUrl, file.fileName)}
                                                    className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-xs font-semibold text-slate-700 hover:text-slate-900 group w-full text-left cursor-pointer"
                                                >
                                                    <Paperclip className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition shrink-0" />
                                                    <span className="truncate flex-1 text-[11px] font-bold">{file.fileName || "View Attached File"}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Modal Body: Tab 2 - Work Reports */}
                        {activeModalTab === "reports" && (() => {
                            // Sort assignments by latest progress update timestamp in descending order (newest update first)
                            const getLatestUpdateTimestamp = (assignment) => {
                                const updates = assignment?.progressUpdates || [];
                                if (updates.length > 0) {
                                    const lastUpdate = updates[updates.length - 1];
                                    return new Date(lastUpdate.updatedAt || lastUpdate.createdAt || 0).getTime();
                                }
                                return new Date(assignment?.updatedAt || assignment?.assignedAt || 0).getTime();
                            };

                            const sortedModalAssignments = [...(selectedTask.assignments || [])].sort((a, b) => {
                                return getLatestUpdateTimestamp(b) - getLatestUpdateTimestamp(a);
                            });

                            // Determine active assignment by selectedAssigneeId or fallback to the first (most recently updated)
                            const currentAssignee = sortedModalAssignments.find(a => {
                                const aId = (a.assignee?._id || a.assignee || "").toString();
                                return aId && aId === selectedAssigneeId?.toString();
                            }) || sortedModalAssignments[0];

                            const currentAssigneeId = (currentAssignee?.assignee?._id || currentAssignee?.assignee || "").toString();

                            return (
                                <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
                                    {/* Horizontal Employee Switcher (Chips with smooth mouse drag-to-scroll & hidden scrollbar) */}
                                    {sortedModalAssignments.length > 1 && (
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                                                Select Assignee
                                            </span>
                                            <div
                                                ref={chipsScrollRef}
                                                onMouseDown={(e) => {
                                                    if (!chipsScrollRef.current) return;
                                                    setIsDraggingChips(true);
                                                    hasDraggedRef.current = false;
                                                    setDragStartX(e.pageX - chipsScrollRef.current.offsetLeft);
                                                    setDragScrollLeft(chipsScrollRef.current.scrollLeft);
                                                }}
                                                onMouseLeave={() => {
                                                    setIsDraggingChips(false);
                                                }}
                                                onMouseUp={() => {
                                                    setIsDraggingChips(false);
                                                }}
                                                onMouseMove={(e) => {
                                                    if (!isDraggingChips || !chipsScrollRef.current) return;
                                                    e.preventDefault();
                                                    const x = e.pageX - chipsScrollRef.current.offsetLeft;
                                                    const walk = (x - dragStartX) * 1.5; // Drag scroll sensitivity
                                                    if (Math.abs(walk) > 3) {
                                                        hasDraggedRef.current = true;
                                                    }
                                                    chipsScrollRef.current.scrollLeft = dragScrollLeft - walk;
                                                }}
                                                className={`flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none ${isDraggingChips ? "cursor-grabbing" : "cursor-grab"
                                                    }`}
                                                style={{ scrollBehavior: isDraggingChips ? "auto" : "smooth" }}
                                            >
                                                {sortedModalAssignments.map((assignment, aIdx) => {
                                                    const aId = (assignment.assignee?._id || assignment.assignee || `assignee-${aIdx}`).toString();
                                                    const isSelected = currentAssigneeId ? currentAssigneeId === aId : aIdx === 0;
                                                    const pCount = assignment.progressUpdates?.length || 0;
                                                    return (
                                                        <button
                                                            key={aId || aIdx}
                                                            type="button"
                                                            onClick={() => {
                                                                if (hasDraggedRef.current) return;
                                                                setSelectedAssigneeId(aId);
                                                            }}
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
                                    {currentAssignee ? (
                                        (() => {
                                            const rawUpdates = currentAssignee.progressUpdates || [];
                                            const updatesWithNumber = rawUpdates.map((update, idx) => ({
                                                ...update,
                                                reportNumber: idx + 1
                                            }));
                                            const sortedUpdates = [...updatesWithNumber].reverse();

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
                                                                {rawUpdates.length}/18 Used
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Work Logs List */}
                                                    {sortedUpdates.length > 0 ? (
                                                        <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                                                            {sortedUpdates.map((update, uIdx) => (
                                                                <div key={uIdx} className="bg-white border border-slate-200/90 p-3 rounded-2xl flex flex-col gap-1.5 shadow-2xs">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                                            Report #{update.reportNumber}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                                            {new Date(update.updatedAt || update.createdAt).toLocaleString("en-GB", {
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
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => openSecureFile(update.attachment.fileUrl, update.attachment.fileName)}
                                                                            className="flex items-center gap-2 p-2 bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-100 rounded-xl transition text-xs font-semibold text-emerald-700 group w-full text-left cursor-pointer"
                                                                        >
                                                                            <FileText className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition shrink-0" />
                                                                            <span className="truncate flex-1 text-[11px] font-bold">{update.attachment.fileName || "View Attachment"}</span>
                                                                            {update.attachment.fileSize && (
                                                                                <span className="text-[10px] text-slate-400 font-normal shrink-0">
                                                                                    ({(update.attachment.fileSize / (1024 * 1024)).toFixed(2)} MB)
                                                                                </span>
                                                                            )}
                                                                        </button>
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
                            );
                        })()}

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end items-center gap-2">
                            {(() => {
                                // Find assignment of currently logged-in user if they are an admin or employee assigned to this task
                                const userAssignment = (currentUserRole === "admin" || currentUserRole === "employee") && selectedTask.assignments?.find(a => {
                                    const assigneeId = (a.assignee?._id || a.assignee)?.toString();
                                    return assigneeId === currentUserId?.toString();
                                });

                                if (!userAssignment) return null;

                                const isCompleted = userAssignment.status === "Completed";

                                return (
                                    <button
                                        type="button"
                                        disabled={isCompleted}
                                        onClick={() => handleUpdateTaskStatus(selectedTask, userAssignment)}
                                        className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition shadow-sm flex items-center gap-1.5 cursor-pointer ${isCompleted
                                            ? "bg-slate-400 cursor-not-allowed opacity-60"
                                            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                                            }`}
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Update Status</span>
                                    </button>
                                );
                            })()}

                            <button
                                type="button"
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