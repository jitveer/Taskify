import { useState, useEffect } from "react";
import { Send, FileText, Paperclip, Calendar, Clock, CheckCircle2, AlertCircle, Eye, X } from "lucide-react";
import { dailyReportApi } from "../../services/api";
import { showSuccess, showError } from "./alerts";

function AdminDailyReportsSection({ color = "blue" }) {
    const activeColor = {
        btn: color === "blue" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" : "bg-purple-600 hover:bg-purple-700 shadow-purple-200",
        ring: color === "blue" ? "focus:ring-blue-500/30 focus:border-blue-500" : "focus:ring-purple-500/30 focus:border-purple-500",
        badgeBg: color === "blue" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"
    };

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // Form state
    const [title, setTitle] = useState("");
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
        if (!title.trim() || !description.trim()) {
            showError("Please fill both Title and Work Description.", "Missing Fields");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("reportDate", reportDate);

            files.forEach(file => {
                formData.append("attachments", file);
            });

            const res = await dailyReportApi.submitReport(formData);
            if (res && res.success) {
                await showSuccess("Your daily report has been sent to Super Admin!", "Report Submitted");
                // Reset form
                setTitle("");
                setDescription("");
                setFiles([]);
                const fileInput = document.getElementById("report-file-input");
                if (fileInput) fileInput.value = "";
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
        <div className="flex flex-col gap-8">
            {/* Top Form: Submit Daily Report */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <FileText size={26} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Submit Daily Work Report</h2>
                        <p className="text-blue-100 text-xs mt-0.5">Share your daily operational summary & activity logs with Super Admin</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Report Title / Subject *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Daily Operations, Team Review & Client Followups"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none ${activeColor.ring} transition font-medium`}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Report Date *
                            </label>
                            <input
                                type="date"
                                value={reportDate}
                                onChange={(e) => setReportDate(e.target.value)}
                                className={`w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm outline-none ${activeColor.ring} transition font-medium`}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Work Details & Key Highlights *
                        </label>
                        <textarea
                            rows="4"
                            placeholder="Detail what was worked on, completed milestones, meetings, or any operational blockers..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-4 text-sm outline-none ${activeColor.ring} transition resize-none font-medium`}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Attachments / Files (Max 5 files, 10MB each)
                        </label>
                        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-100 transition cursor-pointer relative">
                            <input
                                type="file"
                                id="report-file-input"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt"
                            />
                            <div className="flex flex-col items-center justify-center gap-1.5 text-slate-600 text-xs font-semibold">
                                <Paperclip className="w-5 h-5 text-slate-400" />
                                <span>Click or drag documents (PDF, Excel, Images, Word, PPT)</span>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2.5">
                                {files.map((file, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                                        <Paperclip className="w-3 h-3" />
                                        <span className="truncate max-w-[180px]">{file.name}</span>
                                        <span className="text-[10px] font-normal text-blue-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex items-center gap-2 ${activeColor.btn} text-white px-6 py-3.5 rounded-xl font-bold transition shadow-md active:scale-98 cursor-pointer disabled:opacity-50`}
                        >
                            <Send size={16} />
                            <span>{submitting ? "Submitting..." : "Send Daily Report"}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom History: My Submitted Reports */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">My Submitted Reports History</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Logs of daily reports previously sent to Super Admin</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                        {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
                    </span>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-8 text-slate-400 text-sm">Loading your reports...</div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm bg-slate-50/50 rounded-2xl border border-slate-100">
                            No daily reports submitted yet. Use the form above to send your first report!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition line-clamp-1">{rep.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{rep.description}</p>
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

            {/* View Details Modal */}
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
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Title</span>
                                <h3 className="text-base font-bold text-slate-800">{selectedReport.title}</h3>
                            </div>

                            <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Work Description</span>
                                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 whitespace-pre-wrap">
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
