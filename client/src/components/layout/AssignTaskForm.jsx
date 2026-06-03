import { Send, FileText, CheckCircle2 } from "lucide-react";

function AssignTaskForm({ color }) {
    const inputStyle = `w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-${color === "blue" ? "blue" : "purple"}-500/50 focus:border-${color === "blue" ? "blue" : "purple"}-500 transition text-sm font-medium appearance-none`;
    const labelStyle = "block text-slate-700 font-bold mb-1.5 text-[11px] uppercase tracking-wider";
    const selectWrapperStyle = "relative";
    const selectIcon = (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
        </div>
    );

    return (
        <div className="px-4 py-4 md:px-8 md:py-8 max-w-4xl mx-auto pb-24 md:pb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Header Banner */}
                <div className={`${color === "blue" ? "bg-gradient-to-r from-blue-600 to-blue-400" : "bg-gradient-to-r from-purple-600 to-purple-400"} p-5 md:p-6 text-white flex items-center gap-4`}>
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm hidden md:block">
                        <FileText size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">Assign New Task</h2>
                        <p className="text-white/80 text-xs mt-0.5 font-medium">Create and delegate work to your team.</p>
                    </div>
                </div>

                <div className="px-5 py-5 md:px-7 md:py-7">
                    <form className="space-y-4">
                        {/* Task Type */}
                        <div>
                            <label className={labelStyle}>Task Type</label>
                            <div className="flex items-center gap-3 md:gap-4">
                                <label className={`flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition flex-1 has-[:checked]:border-${color === "blue" ? "blue" : "purple"}-500 has-[:checked]:bg-${color === "blue" ? "blue" : "purple"}-50`}>
                                    <input type="radio" name="tasktype" className={`w-4 h-4 text-${color === "blue" ? "blue" : "purple"}-600 focus:ring-${color === "blue" ? "blue" : "purple"}-500`} defaultChecked />
                                    <span className="font-bold text-slate-700 text-sm">Individual</span>
                                </label>
                                <label className={`flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition flex-1 has-[:checked]:border-${color === "blue" ? "blue" : "purple"}-500 has-[:checked]:bg-${color === "blue" ? "blue" : "purple"}-50`}>
                                    <input type="radio" name="tasktype" className={`w-4 h-4 text-${color === "blue" ? "blue" : "purple"}-600 focus:ring-${color === "blue" ? "blue" : "purple"}-500`} />
                                    <span className="font-bold text-slate-700 text-sm whitespace-nowrap">Group Task</span>
                                </label>
                            </div>
                        </div>

                        {/* Grid Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Employee ID */}
                            <div>
                                <label className={labelStyle}>Employee ID</label>
                                <div className={selectWrapperStyle}>
                                    <select className={inputStyle}>
                                        <option value="">Select Employee ID</option>
                                        <option>EMP001</option>
                                        <option>EMP002</option>
                                        <option>EMP003</option>
                                    </select>
                                    {selectIcon}
                                </div>
                            </div>

                            {/* Employee Name */}
                            <div>
                                <label className={labelStyle}>Employee Name</label>
                                <div className={selectWrapperStyle}>
                                    <select className={inputStyle}>
                                        <option value="">Select Employee</option>
                                        <option>John Doe</option>
                                        <option>Sarah Smith</option>
                                        <option>David Miller</option>
                                    </select>
                                    {selectIcon}
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label className={labelStyle}>Department</label>
                                <div className={selectWrapperStyle}>
                                    <select className={inputStyle}>
                                        <option value="">Select Department</option>
                                        <option>Frontend</option>
                                        <option>Backend</option>
                                        <option>UI/UX</option>
                                    </select>
                                    {selectIcon}
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className={labelStyle}>Priority</label>
                                <div className={selectWrapperStyle}>
                                    <select className={inputStyle}>
                                        <option value="">Select Priority</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                    {selectIcon}
                                </div>
                            </div>
                        </div>

                        {/* Task Title */}
                        <div>
                            <label className={labelStyle}>Task Title</label>
                            <input
                                type="text"
                                placeholder="E.g. Redesign Dashboard UI"
                                className={inputStyle}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className={labelStyle}>Task Description</label>
                            <textarea
                                rows="3"
                                placeholder="Explain the requirements in detail..."
                                className={`${inputStyle} resize-none`}
                            ></textarea>
                        </div>

                        {/* Due Date & Attachment Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelStyle}>Due Date</label>
                                <input type="date" className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Attachments</label>
                                <input
                                    type="file"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-200 transition font-medium file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                className={`w-full md:w-auto flex items-center justify-center gap-2 bg-${color === "blue" ? "blue" : "purple"}-600 hover:bg-${color === "blue" ? "blue" : "purple"}-700 text-white px-7 py-3 rounded-xl font-bold transition duration-300 shadow-md shadow-${color === "blue" ? "blue" : "purple"}-200 active:scale-[0.98] text-sm`}
                            >
                                <Send size={18} />
                                Assign Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AssignTaskForm;