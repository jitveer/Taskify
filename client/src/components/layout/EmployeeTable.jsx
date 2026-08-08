import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

import {
    showSuccess,
    showError
} from "../../components/layout/Alerts";


function EmployeeTable({ color, employees = [], apiPrefix }) {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
        department: "",
        role: ""
    });

    const [search, setSearch] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const mobileRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#]).{8,}$/;


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({
            name: "",
            email: "",
            password: "",
            mobile: "",
            department:
                apiPrefix === "/api/admin"
                    ? loggedInUser.department
                    : "",
            role:
                apiPrefix === "/api/admin"
                    ? "employee"
                    : ""
        });
        setShowModal(true);
        setErrors({});
    };

    const editEmployee = (employee) => {
        setFormData({
            employee_id: employee.user_id || "",
            name: employee.name || "",
            email: employee.email || "",
            password: employee.password || "",
            mobile: employee.mobile || "",
            department: employee.department || "",
            role: employee.role || ""
        });
        setEditingId(employee._id);
        setShowModal(true);
    };

    const deleteEmployee = async (id) => {
        const result = await Swal.fire({
            title: "Delete Employee?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) return;

        try {
            // delete employee
            const token = localStorage.getItem("token");

            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}${apiPrefix}/deleteEmployee/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            showSuccess("Employee Deleted Successfully");
            window.location.reload();
        } catch (error) {
            console.log(error);
            showError("Error deleting employee");
        }
    };

    const saveEmployee = async () => {

        const validationErrors = {};

        if (!formData.name?.trim()) {
            validationErrors.name = "Full Name is required";
        }

        if (formData.name?.trim().length < 3) {
            validationErrors.name = "Name must be at least 3 characters";
        }

        if (!emailRegex.test(formData.email)) {
            validationErrors.email = "Only Gmail addresses are allowed";
        }

        if (!mobileRegex.test(formData.mobile)) {
            validationErrors.mobile = "Enter valid 10 digit mobile number";
        }

        if (!passwordRegex.test(formData.password)) {
            validationErrors.password =
                "Password must contain uppercase, lowercase, number and special character";
        }

        if (!formData.department) {
            validationErrors.department = "Please select department";
        }

        if (!formData.role) {
            validationErrors.role = "Please select role";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }


        try {
            if (editingId) {
                // update employee
                const token = localStorage.getItem("token");

                await axios.patch(
                    `${import.meta.env.VITE_BACKEND_URL}${apiPrefix}/updateEmployee/${editingId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                await Swal.fire({
                    icon: "success",
                    title: "Employee Updated Successfully",
                    timer: 1500,
                    showConfirmButton: false
                });

            } else {
                // ADD NEW EMPLOYEE
                const token = localStorage.getItem("token");

                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}${apiPrefix}/addEmployee`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                showSuccess("Employee Added Successfully");
            }

            setShowModal(false);
            setEditingId(null);
            setFormData({
                name: "",
                email: "",
                password: "",
                mobile: "",
                department: "",
                role: ""
            });
            window.location.reload();
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || "Error saving employee");
        }
    };

    const filteredEmployees = employees.filter((emp) =>
        (emp.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (emp.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (emp.department || "").toLowerCase().includes(search.toLowerCase()) ||
        String(emp.user_id || "").toLowerCase().includes(search.toLowerCase())
    );

    const focusRing = color === "blue" ? "focus:ring-blue-500" : "focus:ring-purple-500";
    const btnBg = color === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700";

    return (
        <div className="p-8">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search Employee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-[320px] border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 ${focusRing}`}
                />

                <button
                    onClick={handleOpenAdd}
                    className={`${btnBg} text-white px-6 py-3 rounded-xl font-semibold duration-300 shadow-lg`}
                >
                    + Add Employee
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Sl.No</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Employee ID</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Name</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Email</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Phone</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">Department</th>
                            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {filteredEmployees.map((employee, index) => (
                            <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition last:border-none">
                                <td className="py-4 px-6 text-sm text-slate-500 font-medium">{index + 1}</td>
                                <td className="py-4 px-6 text-sm text-slate-500">{employee.user_id}</td>
                                <td className="py-4 px-6 text-sm font-bold text-slate-800">{employee.name}</td>
                                <td className="py-4 px-6 text-sm text-slate-500">{employee.email}</td>
                                <td className="py-4 px-6 text-sm text-slate-500">Mobile: {employee.mobile || "N/A"}</td>
                                <td className="py-4 px-6 text-sm font-medium text-slate-600">{employee.department}</td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => editEmployee(employee)}
                                            className={`${btnBg} text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteEmployee(employee._id)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden flex flex-col gap-4 bg-slate-50/50 p-2 -mx-4 lg:mx-0">
                {filteredEmployees.map((employee, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 relative">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full bg-${color === 'blue' ? 'blue' : 'purple'}-100 text-${color === 'blue' ? 'blue' : 'purple'}-600 flex justify-center items-center font-bold text-sm`}>
                                    {(employee.name || "E").charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 leading-tight">{employee.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{employee.user_id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Department</span>
                                <span className="font-medium text-slate-700">{employee.department}</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Mobile</span>
                                <span className="font-medium text-slate-700">{employee.mobile || "N/A"}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Email</span>
                                <span className="font-medium text-slate-700 truncate block">{employee.email}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                            <button
                                onClick={() => editEmployee(employee)}
                                className={`${btnBg} text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm w-full md:w-auto`}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteEmployee(employee._id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold transition w-full md:w-auto"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">

                    <div className="bg-white w-[95%] md:w-full max-w-4xl rounded-2xl md:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">

                        {/* Top Accent Bar */}
                        <div className="h-1.5 bg-gradient-to-r from-purple-600 to-indigo-500"></div>

                        {/* Header */}
                        <div className="flex justify-between items-center px-8 pt-8 pb-4">

                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">
                                    {editingId ? "Edit Employee" : "Add Employee"}
                                </h2>

                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-red-500 text-3xl font-bold duration-200"
                            >
                                ×
                            </button>

                        </div>

                        {/* Form */}
                        <div className="px-8 pb-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Name */}
                                <div className="relative pb-5">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full border bg-slate-50 p-3 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${errors.name ? "border-red-500" : "border-slate-300"}`}
                                    />

                                    {errors.name && (
                                        <p className="absolute bottom-0 left-1 text-red-500 text-xs">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="relative pb-5">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full border bg-slate-50 p-3 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${errors.email ? "border-red-500" : "border-slate-300"}`}
                                    />

                                    {errors.email && (
                                        <p className="absolute bottom-0 left-1 text-red-500 text-xs">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="relative pb-5">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Password
                                    </label>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full border bg-slate-50 p-3 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${errors.password ? "border-red-500" : "border-slate-300"}`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-[46px] text-gray-500"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>

                                    {errors.password && (
                                        <p className="absolute bottom-0 left-1 text-red-500 text-xs">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Mobile */}
                                <div className="relative pb-5">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Mobile Number
                                    </label>

                                    <input
                                        type="text"
                                        name="mobile"
                                        placeholder="Enter Mobile Number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className={`w-full border bg-slate-50 p-3 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${errors.mobile ? "border-red-500" : "border-slate-300"}`}
                                    />

                                    {errors.mobile && (
                                        <p className="absolute bottom-0 left-1 text-red-500 text-xs">
                                            {errors.mobile}
                                        </p>
                                    )}
                                </div>

                                {/* Department */}
                                <div className="relative pb-5">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Department
                                    </label>

                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        disabled={apiPrefix === "/api/admin"}
                                        className={`w-full border bg-slate-50 p-3 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${errors.department ? "border-red-500" : "border-slate-300"}`}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="csr">CSR</option>
                                        <option value="it">IT</option>
                                        <option value="hr">HR</option>
                                        <option value="interior">Interior</option>
                                        <option value="sales">Sales</option>
                                        <option value="accounts">Accounts</option>
                                    </select>

                                    {errors.department && (
                                        <p className="absolute bottom-0 left-1 text-red-500 text-xs">
                                            {errors.department}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div className="relative pb-5">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        disabled={apiPrefix === "/api/admin"}
                                        className={`w-full border bg-slate-50 p-3 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-purple-500
                            ${errors.role ? "border-red-500" : "border-slate-300"}`}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="employee">Employee</option>
                                    </select>

                                    {errors.role && (
                                        <p className="absolute bottom-0 left-1 text-red-500 text-xs">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-slate-200">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingId(null);
                                        setErrors({});
                                    }}
                                    className="px-3 md:px-6 py-2 md:py-3 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs md:text-base font-medium duration-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={saveEmployee}
                                    className="px-3 md:px-6 py-2 md:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs md:text-base font-medium shadow-lg duration-200"
                                >
                                    {editingId ? "Update" : "Add"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default EmployeeTable;