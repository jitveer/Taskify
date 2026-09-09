import { useState, useEffect } from "react";
import { 
    FileText, 
    Calendar, 
    Paperclip, 
    Eye, 
    X, 
    Search, 
    Filter, 
    User, 
    Building2, 
    Clock, 
    CheckCircle2, 
    RefreshCw,
    Download
} from "lucide-react";
import { dailyReportApi } from "../../services/api";

function SuperAdminDailyReportsView({ color = "purple" }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    // Filters
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchReports = async () => {
        try {
            setLoading(true);
            const params = {};
            if (department) params.department = department;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await dailyReportApi.getAllReports(params);
            if (res && res.success) {
                setReports(res.reports || []);
            }
        } catch (error) {
            console.error("Failed to load daily reports for super admin:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [department, startDate, endDate]);

    // Client-side search filtering
    const filteredReports = reports.filter((rep) => {
        const query = search.toLowerCase();
        const titleMatch = (rep.title || "").toLowerCase().includes(query);
        const descMatch = (rep.description || "").toLowerCase().includes(query);
        const adminNameMatch = (rep.submittedBy?.name || "").toLowerCase().includes(query);
        const deptMatch = (rep.department || "").toLowerCase().includes(query);
        return titleMatch || descMatch || adminNameMatch || deptMatch;
    });

    const resetFilters = () => {
        setSearch("");
        setDepartment("");
        setStartDate("");
        setEndDate("");
    };

    // Unique list of departments from fetched reports
    const departmentsList = Array.from(new Set(reports.map(r => r.department).filter(Boolean)));

    return (
        <div className="space-y-6">
            {/* Header & Filter Controls */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Admin Daily Work Reports</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Review voluntary daily operational summaries, work logs, and attachments submitted by Admins
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchReports}
                            className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition cursor-pointer"
                        >
                            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                            <span>Refresh</span>
                        </button>
                        <span className="px-3.5 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                            Total: {filteredReports.length}
                        </span>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search admin, title, keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition font-medium"
                        />
                    </div>

                    {/* Department Filter */}
                    <div>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition font-medium cursor-pointer"
                        >
                            <option value="">All Departments</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="Design">Design</option>
                            <option value="Operations">Operations</option>
                            {departmentsList.map(dept => (
                                !["IT", "HR", "Marketing", "Sales", "Design", "Operations"].includes(dept) && (
                                    <option key={dept} value={dept}>{dept}</option>
                                )
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <input
                            type="date"
                            value={startDate}
                            placeholder="From Date"
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition font-medium"
                        />
                    </div>

                    {/* End Date */}
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={endDate}
                            placeholder="To Date"
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition font-medium"
                        />
                        {(search || department || startDate || endDate) && (
                            <button
                                onClick={resetFilters}
                                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                                title="Reset Filters"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="text-center py-16 text-slate-400 text-sm font-medium">
                        Loading admin daily reports...
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-sm bg-slate-50/50">
                        No daily reports found matching your criteria.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                        {filteredReports.map((rep) => (
                            <div
                                key={rep._id}
                                onClick={() => setSelectedReport(rep)}
                                className="p-5 bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-purple-300 rounded-2xl transition cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between gap-4 group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Building2 className="w-3 h-3" />
                                            {rep.department}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(rep.reportDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                        </span>
                                    </div>

                                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition line-clamp-1 mb-1">
                                        {rep.title}
                                    </h4>

                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                                        {rep.description}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center uppercase">
                                            {rep.submittedBy?.name ? rep.submittedBy.name.charAt(0) : "A"}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-700 leading-tight">
                                                {rep.submittedBy?.name || "Admin"}
                                            </span>
                                            <span className="text-[9px] text-slate-400">
                                                {rep.submittedBy?.email || ""}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {rep.attachments?.length > 0 && (
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold flex items-center gap-1">
                                                <Paperclip className="w-3 h-3" />
                                                {rep.attachments.length}
                                            </span>
                                        )}
                                        <span className="text-purple-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition">
                                            <Eye className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detailed View Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-slideUp">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <FileText size={22} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold">Admin Daily Work Report</h3>
                                    <p className="text-purple-200 text-xs mt-0.5">
                                        Submitted by {selectedReport.submittedBy?.name || "Admin"} ({selectedReport.submittedBy?.email})
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition flex justify-center items-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                                    <span className="font-bold text-slate-800">{selectedReport.department}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Date</span>
                                    <span className="font-bold text-slate-800">
                                        {new Date(selectedReport.reportDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted At</span>
                                    <span className="font-bold text-slate-800">
                                        {new Date(selectedReport.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Subject / Title</span>
                                <h4 className="text-base font-bold text-slate-800 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                                    {selectedReport.title}
                                </h4>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Work Description & Key Accomplishments</span>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                    {selectedReport.description}
                                </div>
                            </div>

                            {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                                        Attached Files ({selectedReport.attachments.length})
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {selectedReport.attachments.map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={`${import.meta.env.VITE_BACKEND_URL}${file.fileUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2.5 p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl transition text-xs font-bold text-purple-700 group"
                                            >
                                                <FileText className="w-4 h-4 text-purple-600 group-hover:scale-110 transition shrink-0" />
                                                <span className="truncate flex-1 text-[11px]">{file.fileName || "Download Attached File"}</span>
                                                {file.fileSize && (
                                                    <span className="text-[10px] text-slate-400 font-normal shrink-0">
                                                        ({(file.fileSize / (1024 * 1024)).toFixed(2)} MB)
                                                    </span>
                                                )}
                                                <Download className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-700 shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="px-6 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition shadow-2xs cursor-pointer"
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

export default SuperAdminDailyReportsView;
