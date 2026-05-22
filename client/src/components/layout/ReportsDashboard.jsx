import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

function ReportsDashboard({ color }) {
    // Defaulting to emerald since it's the Employee context primarily, but making it flexible
    const themeColor = color === "blue" ? "blue" : color === "purple" ? "purple" : "emerald";

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Your Task Reports</h2>
                <p className="text-sm text-slate-500 mt-1">Overview of all your task metrics</p>
            </div>

            {/* Cards - 2 columns on mobile, 4 columns on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                
                {/* Total Tasks */}
                <div className="group relative overflow-hidden bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                            <FileText size={22} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <h2 className="text-slate-500 font-medium text-xs md:text-sm mb-1 group-hover:text-emerald-50 transition-colors duration-300">Total Tasks</h2>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors duration-300">145</h1>
                </div>

                {/* Completed */}
                <div className="group relative overflow-hidden bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 bg-green-100 text-green-600 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                            <CheckCircle2 size={22} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <h2 className="text-slate-500 font-medium text-xs md:text-sm mb-1 group-hover:text-green-50 transition-colors duration-300">Completed</h2>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors duration-300">96</h1>
                </div>

                {/* Pending */}
                <div className="group relative overflow-hidden bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                            <Clock size={22} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <h2 className="text-slate-500 font-medium text-xs md:text-sm mb-1 group-hover:text-amber-50 transition-colors duration-300">Pending</h2>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors duration-300">31</h1>
                </div>

                {/* In Progress */}
                <div className="group relative overflow-hidden bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                            <AlertCircle size={22} className="md:w-6 md:h-6" />
                        </div>
                    </div>
                    <h2 className="text-slate-500 font-medium text-xs md:text-sm mb-1 group-hover:text-blue-50 transition-colors duration-300">In Progress</h2>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight group-hover:text-white transition-colors duration-300">18</h1>
                </div>

            </div>
        </div>
    );
}

export default ReportsDashboard;