function TaskStatusTable({ color }) {
    const statuses = [
        { employee: "Rahul", task: "UI Design", progress: "25%", status: "Pending" },
        { employee: "Priya", task: "Backend API", progress: "70%", status: "In Progress" },
        { employee: "Karan", task: "Testing", progress: "100%", status: "Completed" }
    ];

    const getStatusColor = (status) => {
        if (status === "Completed") return "bg-green-100 text-green-700";
        if (status === "In Progress") return "bg-blue-100 text-blue-700";
        return "bg-amber-100 text-amber-700";
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                
                {/* Header Section */}
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Team Task Status</h2>
                    <p className="text-sm text-slate-500 mt-1">Monitor the progress of your team members.</p>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Employee</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Task</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Progress</th>
                                <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statuses.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition border-b border-slate-50 last:border-none">
                                    <td className="py-4 px-6 text-sm font-bold text-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full bg-${color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : 'emerald'}-100 text-${color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : 'emerald'}-600 flex justify-center items-center font-bold text-xs`}>
                                                {item.employee.charAt(0)}
                                            </div>
                                            {item.employee}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-slate-700">
                                        {item.task}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                                <div 
                                                    className={`h-1.5 rounded-full ${item.progress === '100%' ? 'bg-green-500' : 'bg-amber-500'}`} 
                                                    style={{width: item.progress}}
                                                ></div>
                                            </div>
                                            <span className="text-slate-500 text-xs">{item.progress}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden flex flex-col gap-4 p-4 bg-slate-50/50">
                    {statuses.map((item, index) => (
                        <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 relative">
                            
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className={`w-10 h-10 rounded-full bg-${color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : 'emerald'}-100 text-${color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : 'emerald'}-600 flex justify-center items-center font-bold text-sm`}>
                                    {item.employee.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 leading-tight">{item.employee}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{item.task}</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <div className="w-1/2">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Progress</span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                                            <div 
                                                className={`h-1.5 rounded-full ${item.progress === '100%' ? 'bg-green-500' : 'bg-amber-500'}`} 
                                                style={{width: item.progress}}
                                            ></div>
                                        </div>
                                        <span className="text-slate-600 font-bold text-xs">{item.progress}</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TaskStatusTable;