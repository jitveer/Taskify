import { useState, useEffect } from "react";
import { Send, FileText, Paperclip, Calendar, Eye, X, Plus, Clock, Search, Building2 } from "lucide-react";
import { dailyReportApi } from "../../services/api";
import { showSuccess, showError } from "./alerts";

function AdminDailyReportsSection({ color = "blue" }) {
    const activeColor = {
        btn: color === "blue" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" : "bg-purple-600 hover:bg-purple-700 shadow-purple-200",
        ring: color === "blue" ? "focus:ring-blue-500/30 focus:border-blue-500" : "focus:ring-purple-500/30 focus:border-purple-500",
        badgeBg: color === "blue" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200",
        fab: color === "blue" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/40" : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/40"
    };

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    // Form state (Title removed as requested, only description, date, and attachments)
    const [description, setDescription] = useState("");
    const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
    const [files, setFiles] = useState([]);

    const fetchMyReports = async () => {
        try {
            setLoading(true);
            const res = await dailyReportApi.getMyReports();
            if (res && res.success) {
                setReports(res.reports || []);
            }
        } catch (err) {
            console.error("Fetch reports error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyReports();
    }, []);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        // Validate max 10MB each
        const oversized = selectedFiles.some(f => f.size > 10 * 1024 * 1024);
        if (oversized) {
            showError("Each file size must be less than 10MB.", "File Too Large");
            return;
        }
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            showError("Please enter your work details / description.", "Missing Field");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("description", description.trim());
            formData.append("reportDate", reportDate);

            files.forEach(file => {
                formData.append("attachments", file);
            });

            const res = await dailyReportApi.submitReport(formData);
            if (res && res.success) {
                await showSuccess("Your daily report has been sent to Super Admin!", "Report Submitted");
                // Reset form
                setDescription("");
                setFiles([]);
                const fileInput = document.getElementById("report-file-input");
                if (fileInput) fileInput.value = "";
                const modalFileInput = document.getElementById("modal-report-file-input");
                if (modalFileInput) modalFileInput.value = "";
                
                setIsSubmitModalOpen(false);
                // Refresh list
                fetchMyReports();
            }
        } catch (err) {
            console.error("Submit Report Error:", err);
            showError(err.message || "Failed to submit daily report.", "Error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 relative">
            {/* My Submitted Reports History (Visible on Mobile, Tablet & Desktop) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-slate-800">My Submitted Reports History</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Logs of daily reports previously sent to Super Admin</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold shrink-0">
                            {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
                        </span>
                        <button
                            onClick={() => setIsSubmitModalOpen(true)}
                            className={`flex items-center gap-2 ${activeColor.btn} text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md active:scale-95 cursor-pointer shrink-0`}
                        >
                            <Plus size={16} className="stroke-[2.5]" />
                            <span>Add Daily Report</span>
                        </button>
                    </div>
                </div>

                <div className="p-4 md:p-6">
                    {loading ? (
                        <div className="text-center py-12 text-slate-400 text-sm">Loading your reports...</div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm bg-slate-50/50 rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center gap-3">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <FileText size={24} />
                            </div>
                            <p className="font-medium text-slate-600">No daily reports submitted yet.</p>
                            <button
                                onClick={() => setIsSubmitModalOpen(true)}
                                className={`flex items-center gap-1.5 ${activeColor.btn} text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer mt-1`}
                            >
                                <Plus size={14} className="stroke-[2.5]" />
                                <span>Add Your First Report</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reports.map((rep) => (
                                <div
                                    key={rep._id}
                                    onClick={() => setSelectedReport(rep)}
                                    className="p-4 bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-blue-300 rounded-2xl transition cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between gap-3 group"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(rep.reportDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                            </span>
                                            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold uppercase text-slate-600">
                                                {rep.department}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-700 line-clamp-3 leading-relaxed">
                                            {rep.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-xs">
                                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                                            <Paperclip className="w-3.5 h-3.5" />
                                            {rep.attachments?.length || 0} {rep.attachments?.length === 1 ? 'file' : 'files'}
                                        </span>
                                        <span className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition">
                                            <span>View Details</span>
                                            <Eye className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button (+) for Mobile/Tablet convenience */}
            <button
                onClick={() => setIsSubmitModalOpen(true)}
                className={`sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full text-white ${activeColor.fab} shadow-xl flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105 cursor-pointer`}
                title="Add Daily Report"
                aria-label="Add Daily Report"
            >
                <Plus size={28} className="stroke-[2.5]" />
            </button>

            {/* 4. Mobile/Tablet Submit Daily Report Popup Modal */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-slideUp">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold">New Daily Report</h3>
                                    <p className="text-blue-100 text-[11px]">Send report to Super Admin</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsSubmitModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition flex justify-center items-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Report Date *
                                </label>
                                <input
                                    type="date"
                                    value={reportDate}
                                    onChange={(e) => setReportDate(e.target.value)}
                                    className={`w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs outline-none ${activeColor.ring} transition font-medium`}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Work Details & Highlights *
                                </label>
                                <textarea
                                    rows="5"
                                    placeholder="Write your day's work summary, tasks completed, operational updates..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs outline-none ${activeColor.ring} transition resize-none font-medium`}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Attachments (Max 5 files, 10MB each)
                                </label>
                                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-3 text-center hover:bg-slate-100 transition cursor-pointer relative">
                                    <input
                                        type="file"
                                        id="modal-report-file-input"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt"
                                    />
                                    <div className="flex flex-col items-center justify-center gap-1 text-slate-600 text-[11px] font-semibold">
                                        <Paperclip className="w-4 h-4 text-slate-400" />
                                        <span>Click or drag documents</span>
                                    </div>
                                </div>

                                {files.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {files.map((file, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100">
                                                <Paperclip className="w-2.5 h-2.5" />
                                                <span className="truncate max-w-[140px]">{file.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsSubmitModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex items-center gap-2 ${activeColor.btn} text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md active:scale-98 cursor-pointer disabled:opacity-50`}
                                >
                                    <Send size={14} />
                                    <span>{submitting ? "Sending..." : "Submit Report"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 5. View Details Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-slideUp">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                            <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 font-mono text-xs border border-slate-200 font-bold">
                                Daily Report Details
                            </span>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/60 transition flex justify-center items-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                                    Dept: {selectedReport.department}
                                </span>
                                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    {new Date(selectedReport.reportDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                </span>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Work Description</span>
                                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 whitespace-pre-wrap font-medium">
                                    {selectedReport.description}
                                </p>
                            </div>

                            {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                                        Attached Files ({selectedReport.attachments.length})
                                    </span>
                                    <div className="flex flex-col gap-1.5">
                                        {selectedReport.attachments.map((file, fIdx) => (
                                            <a
                                                key={fIdx}
                                                href={`${import.meta.env.VITE_BACKEND_URL}${file.fileUrl}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition text-xs font-semibold text-blue-700 group"
                                            >
                                                <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition shrink-0" />
                                                <span className="truncate flex-1 text-[11px] font-bold">{file.fileName || "View Attached File"}</span>
                                                {file.fileSize && (
                                                    <span className="text-[10px] text-slate-400 font-normal shrink-0">
                                                        ({(file.fileSize / (1024 * 1024)).toFixed(2)} MB)
                                                    </span>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
                            <button
                                onClick={() => setSelectedReport(null)}
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

export default AdminDailyReportsSection;
