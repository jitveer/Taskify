import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, FileText, CheckCircle2 } from "lucide-react";
import {
    showSuccess,
    showError,
    showConfirm
} from "../../components/layout/alerts";

function AssignTaskForm({ color, apiPrefix }) {

    const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

    const [formData, setFormData] = useState({
        taskType:
            apiPrefix === "/api/admin"
                ? "Individual"
                : "",

        department:
            apiPrefix === "/api/admin"
                ? loggedInUser.department
                : "",
        employeeName: "",
        priority: "",
        taskTitle: "",
        description: "",
        dueDate: "",
        attachment: null
    });


    const fetchUsers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}${apiPrefix}/allUser`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUserList(
                response.data.users ||
                response.data.employees ||
                []
            );

        } catch (error) {

            console.log(error);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);


    const [userList, setUserList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [errors, setErrors] = useState({});
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
    const employeeDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                employeeDropdownRef.current &&
                !employeeDropdownRef.current.contains(event.target)
            ) {
                setIsEmployeeDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const inputStyle = `w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-${color === "blue" ? "blue" : "purple"}-500/50 focus:border-${color === "blue" ? "blue" : "purple"}-500 transition text-sm font-medium appearance-none`;
    const labelStyle = "block text-slate-700 font-bold mb-1.5 text-[11px] uppercase tracking-wider";
    const selectWrapperStyle = "relative";
    const selectIcon = (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
        </div>
    );


    const validateForm = () => {

        const newErrors = {};

        if (!formData.taskType)
            newErrors.taskType = "Task Type is required";

        if (
            formData.taskType === "Group Task" &&
            !formData.department
        )
            newErrors.department = "Department is required";

        if (
            formData.taskType === "Group Task" &&
            !formData.employeeName
        )
            newErrors.employeeName = "Admin is required";

        if (
            formData.taskType === "Individual" &&
            selectedEmployees.length === 0
        )
            newErrors.employeeName = "Select at least one employee";

        if (!formData.priority)
            newErrors.priority = "Priority is required";

        if (!formData.taskTitle.trim())
            newErrors.taskTitle = "Task Title is required";

        if (!formData.description.trim())
            newErrors.description = "Description is required";

        if (!formData.dueDate)
            newErrors.dueDate = "Due Date is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };



    // Assign task function
    const handleAssignTask = async () => {

        if (!validateForm()) return;

        const result = await showConfirm(
            "Assign Task?",
            "Do you want to assign this task?"
        );

        if (!result.isConfirmed) return;

        try {

            const token = localStorage.getItem("token");

            const loggedInUser =
                JSON.parse(localStorage.getItem("user")) || {};

            console.log("Logged User:", loggedInUser);

            const payload = new FormData();

            payload.append(
                "assignedBy",
                loggedInUser.id
            );

            payload.append(
                "assignedTo",
                JSON.stringify(
                    formData.taskType === "Individual"
                        ? selectedEmployees
                        : [formData.employeeName]
                )
            );

            if (formData.taskType === "Group Task") {
                payload.append(
                    "department",
                    formData.department
                );
            }

            payload.append(
                "taskType",
                formData.taskType === "Group Task"
                    ? "group_task"
                    : "individual"
            );

            payload.append(
                "priority",
                formData.priority.toLowerCase()
            );

            payload.append(
                "title",
                formData.taskTitle
            );

            payload.append(
                "description",
                formData.description
            );

            payload.append(
                "dueDate",
                new Date(formData.dueDate).toISOString()
            );

            if (formData.attachment?.length > 0) {

                formData.attachment.forEach((file) => {
                    payload.append("attachments", file);
                });

            }

            console.log("Payload:", payload);

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}${apiPrefix}/addTask`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("Response:", response.data);

            showSuccess("Task Assigned Successfully");

            // Reset form data and inputs
            setFormData({
                taskType: apiPrefix === "/api/admin" ? "Individual" : "",
                department: apiPrefix === "/api/admin" ? loggedInUser.department : "",
                employeeName: "",
                priority: "",
                taskTitle: "",
                description: "",
                dueDate: "",
                attachment: null
            });
            setSelectedEmployees([]);
            setSearchTerm("");
            setErrors({});

            // Clear the file input DOM element value
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.value = "";
            }

        } catch (error) {

            console.log("FULL ERROR:", error.response?.data);

            showError(
                error.response?.data?.message ||
                "Unable to Assign Task"
            );
        }
    };


    // filter based on task type
    const filteredAdmins = userList.filter(
        (user) =>
            user.role === "admin" &&
            user.department === formData.department
    );

    const filteredEmployees = userList
        .filter((user) => {

            if (apiPrefix === "/api/admin") {
                return (
                    user.role === "employee" &&
                    user.department === loggedInUser.department
                );
            }

            return user.role === "employee";
        })
        .filter((user) =>
            user.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );

    const selectedNames = selectedEmployees
        .map(id => userList.find(u => u._id === id)?.name)
        .filter(Boolean);
    const displayText = selectedNames.length === 0
        ? "Select Employees"
        : selectedNames.join(", ");

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
                        {/* Grid Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Task Type - Hidden for Admin, shown only for superadmin or others */}
                            {apiPrefix !== "/api/admin" ? (
                                <div>
                                    <label className={labelStyle}>Task Type</label>

                                    <div className={selectWrapperStyle}>
                                        <select
                                            name="taskType"
                                            value={formData.taskType}
                                            disabled={apiPrefix === "/api/admin"}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    taskType: value,
                                                    department: "",
                                                    employeeName: ""
                                                });
                                                setSelectedEmployees([]);
                                                setSearchTerm("");
                                            }}
                                            className={`${inputStyle} ${errors.taskType ? "border-red-500" : ""}`}
                                        >
                                            <option value="">Select Task Type</option>
                                            <option value="Individual">Individual Task</option>
                                            {apiPrefix === "/api/superadmin" && (
                                                <option value="Group Task">
                                                    Group Task
                                                </option>
                                            )}
                                        </select>

                                        {selectIcon}
                                    </div>

                                    {errors.taskType && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.taskType}
                                        </p>
                                    )}
                                </div>
                            ) : null}


                            {/* Department - Hidden for Admin since they assign to individual employees only */}
                            {apiPrefix !== "/api/admin" && formData.taskType !== "Individual" ? (
                                <div>
                                    <label className={labelStyle}>Department</label>

                                    <div className={selectWrapperStyle}>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            disabled={formData.taskType === "" || apiPrefix === "/api/admin"}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setFormData({
                                                    ...formData,
                                                    department: value,
                                                    employeeName: ""
                                                });

                                            }}
                                            className={`${inputStyle} ${errors.department ? "border-red-500" : ""} disabled:opacity-60 disabled:cursor-not-allowed`}
                                        >
                                            <option value="">Select Department</option>
                                            <option value="csr">CSR</option>
                                            <option value="it">IT</option>
                                            <option value="hr">HR</option>
                                            <option value="interior">Interior</option>
                                            <option value="sales">Sales</option>
                                            <option value="accounts">Accounts</option>
                                        </select>

                                        {selectIcon}
                                    </div>

                                    {errors.department && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.department}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                apiPrefix !== "/api/admin" && <div className="hidden md:block"></div>
                            )}



                            {/* Employee Name */}

                            {formData.taskType === "Individual" ? (

                                <div className="relative" ref={employeeDropdownRef}>
                                    <label className={labelStyle}>Employee Name</label>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                                            className={`${inputStyle} text-left flex justify-between items-center pr-10 ${errors.employeeName ? "border-red-500" : ""}`}
                                        >
                                            <span className="truncate block pr-2">
                                                {displayText}
                                            </span>
                                        </button>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                            <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>

                                    {isEmployeeDropdownOpen && (
                                        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-3 max-h-72 flex flex-col gap-2">
                                            {/* Search Box */}
                                            <input
                                                type="text"
                                                placeholder="Search Employee Name"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 outline-none text-xs font-medium focus:ring-2 focus:ring-purple-500/50"
                                            />

                                            {/* Employee List */}
                                            <div className="overflow-y-auto flex-1 max-h-48 border border-slate-100 rounded-lg p-2 bg-slate-50">
                                                {filteredEmployees.length === 0 ? (
                                                    <div className="text-slate-400 text-xs text-center py-4">No employees found</div>
                                                ) : (
                                                    filteredEmployees.map((user) => (
                                                        <label
                                                            key={user._id}
                                                            className="flex items-center gap-3 py-1.5 px-2 hover:bg-slate-100/80 rounded-md cursor-pointer text-xs font-medium text-slate-700"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className={`rounded border-slate-300 text-${color === "blue" ? "blue" : "purple"}-600 focus:ring-${color === "blue" ? "blue" : "purple"}-500/50`}
                                                                checked={selectedEmployees.includes(user._id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedEmployees([
                                                                            ...selectedEmployees,
                                                                            user._id
                                                                        ]);
                                                                    } else {
                                                                        setSelectedEmployees(
                                                                            selectedEmployees.filter(
                                                                                id => id !== user._id
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            <span className="truncate">
                                                                {user.name} ({user.user_id})
                                                            </span>
                                                        </label>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {errors.employeeName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.employeeName}
                                        </p>
                                    )}
                                </div>

                            ) : (

                                <div>
                                    <label className={labelStyle}>Admin Name</label>

                                    <div className={selectWrapperStyle}>
                                        <select
                                            name="employeeName"
                                            value={formData.employeeName}
                                            disabled={formData.taskType === "" || formData.department === ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    employeeName: e.target.value
                                                })
                                            }
                                            className={`${inputStyle} ${errors.employeeName ? "border-red-500" : ""} disabled:opacity-60 disabled:cursor-not-allowed`}
                                        >
                                            <option value="">Select Admin</option>

                                            {filteredAdmins.map((user) => (
                                                <option
                                                    key={user._id}
                                                    value={user._id}
                                                >
                                                    {user.name} ({user.user_id})
                                                </option>
                                            ))}
                                        </select>

                                        {selectIcon}
                                    </div>

                                    {errors.employeeName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.employeeName}
                                        </p>
                                    )}
                                </div>
                            )}


                            {/* Priority */}
                            <div>
                                <label className={labelStyle}>Priority</label>

                                <div className={selectWrapperStyle}>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                priority: e.target.value
                                            })
                                        }
                                        className={`${inputStyle} ${errors.priority ? "border-red-500" : ""}`}
                                    >
                                        <option value="">Select Priority</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>

                                    {selectIcon}
                                </div>

                                {errors.priority && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.priority}
                                    </p>
                                )}
                            </div>
                        </div>



                        {/* Task Title */}
                        <div>
                            <label className={labelStyle}>Task Title</label>

                            <input
                                type="text"
                                name="taskTitle"
                                value={formData.taskTitle}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        taskTitle: e.target.value
                                    })
                                }
                                placeholder="E.g. Redesign Dashboard UI"
                                className={`${inputStyle} ${errors.taskTitle ? "border-red-500" : ""}`}
                            />

                            {errors.taskTitle && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.taskTitle}
                                </p>
                            )}
                        </div>



                        {/* Description */}
                        <div>
                            <label className={labelStyle}>Task Description</label>

                            <textarea
                                rows="3"
                                name="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value
                                    })
                                }
                                className={`${inputStyle} resize-none ${errors.description ? "border-red-500" : ""}`}
                            />

                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>



                        {/* Due Date & Attachment Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Due Date */}
                            <div>
                                <label className={labelStyle}>Due Date</label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            dueDate: e.target.value
                                        })
                                    }
                                    className={`${inputStyle} ${errors.dueDate ? "border-red-500" : ""}`}
                                />

                                {errors.dueDate && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.dueDate}
                                    </p>
                                )}
                            </div>



                            {/* Attachment */}
                            <div>
                                <label className={labelStyle}>Attachments</label>

                                <input
                                    type="file"
                                    name="attachments"
                                    multiple
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            attachment: Array.from(e.target.files)
                                        })
                                    }
                                    className={`${inputStyle} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0`}
                                />
                            </div>

                        </div>


                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleAssignTask}
                                className={`w-full md:w-auto flex items-center justify-center gap-2 bg-${color === "blue" ? "blue" : "purple"}-600 hover:bg-${color === "blue" ? "blue" : "purple"}-700 text-white px-7 py-3 rounded-xl font-bold transition duration-300 shadow-md shadow-${color === "blue" ? "blue" : "purple"}-200 active:scale-[0.98] text-sm`}
                            >
                                <Send size={18} />
                                Assign Task
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}

export default AssignTaskForm;