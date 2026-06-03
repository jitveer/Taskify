import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    showSuccess,
    showError,
    showWarning
} from "../../components/layout/Alerts";




function AdminList() {

    const [showPopup, setShowPopup] = useState(false);

    const [admins, setAdmins] = useState([
    ]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});

    {/* Form validation */ }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    const mobileRegex = /^[0-9]{10}$/;

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#]).{8,}$/;


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
        department: "",
        role: ""
    });

    const menuItems = [
        { name: "Dashboard", path: "/super-admin-dashboard" },
        { name: "Admin List", path: "/admin-list" },
        { name: "Employee List", path: "/employee-list" },
        { name: "Assign Task", path: "/assign-task" },
        { name: "My Tasks", path: "/my-tasks" },
        { name: "Task Status", path: "/task-status" },
        { name: "Reports", path: "/reports" }
    ];


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };




    // add and delete admins 
    const addAdmin = async () => {

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

            // UPDATE EXISTING ADMIN
            if (editingId) {

                await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/superadmin/addadmin`,
                    formData
                );

                showSuccess("Admin Updated Successfully");

            }

            // ADD NEW ADMIN
            else {

                const token = localStorage.getItem("token");

                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/superadmin/addadmin`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                showSuccess("Admin Added Successfully");
            }

            // CLOSE POPUP
            setShowPopup(false);

            // CLEAR EDIT ID
            setEditingId(null);

            // RESET FORM
            setFormData({
                name: "",
                email: "",
                password: "",
                mobile: "",
                department: "",
                role: ""
            });

            // REFRESH TABLE
            fetchAdmins();

        } catch (error) {

            console.log(error);

            alert(error.response?.data?.message || "Error saving admin");
        }
    };



    // fetch admins 
    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/superadmin/adminLists`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            console.log(response.data.admins);
            setAdmins(response.data.admins);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {

        fetchAdmins();

    }, []);

    const filteredAdmins = admins.filter((admin) =>
        admin.name.toLowerCase().includes(search.toLowerCase()) ||
        admin.email.toLowerCase().includes(search.toLowerCase()) ||
        admin.department.toLowerCase().includes(search.toLowerCase())
    );




    const deleteAdmin = async (id) => {

        const result = await showWarning(
            "Delete Admin?",
            "This action cannot be undone."
        );

        if (!result.isConfirmed) return;

        try {

            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admins/${id}`
            );

            showSuccess("Admin deleted successfully");

            fetchAdmins();

        } catch (error) {

            console.log(error);

            showWarning("Error deleting admin");
        }
    };




    const editAdmin = (admin) => {

        setFormData({
            name: admin.name,
            email: admin.email,
            password: admin.password,
            mobile: admin.mobile,
            department: admin.department,
            role: admin.role
        });

        setEditingId(admin._id);

        setShowPopup(true);
    };


    // const admins = [
    //     { id: "ADM001", name: "John Doe", email: "john@taskify.com", phone: "9876543210", dept: "Operations" },
    //     { id: "ADM002", name: "Sarah Smith", email: "sarah@taskify.com", phone: "9876541230", dept: "Human Resources" },
    //     { id: "ADM003", name: "David Miller", email: "david@taskify.com", phone: "9876509876", dept: "IT & Tech" }
    // ];

    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Super Admin" menuItems={menuItems} color="purple" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full overflow-hidden">
                {/* Header */}
                <Header title="Admin List" role="Super Admin" />

                <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">

                    {/* Top Section */}
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
                        <div className="relative w-full lg:w-[350px]">
                            <input
                                type="text"
                                placeholder="Search administrators..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-sm font-medium"
                            />
                        </div>

                        <button onClick={() => setShowPopup(true)} className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-2xl font-bold transition duration-300 shadow-lg shadow-purple-200 active:scale-[0.98]">
                            + Add New Admin
                        </button>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-5 px-6 text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-100">Administrator</th>
                                    <th className="py-5 px-6 text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-100">Contact Details</th>
                                    <th className="py-5 px-6 text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-100">Department</th>
                                    <th className="py-5 px-6 text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-100 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAdmins.map((admin, index) => (
                                    <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition duration-150 last:border-none">
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">{admin.name}</p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{admin.admin_id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <p className="text-sm font-bold text-slate-700">{admin.email}</p>
                                            <p className="text-xs text-slate-400 font-medium mt-1">Mobile: {admin.mobile || "N/A"}</p>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                                {admin.department}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => editAdmin(admin)} className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-xs font-bold transition">Edit</button>
                                                <button onClick={() => deleteAdmin(admin._id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Card Layout */}
                    <div className="lg:hidden flex flex-col gap-4">
                        {filteredAdmins.map((admin, index) => (
                            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-purple-100">
                                            {admin.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 text-lg leading-tight">{admin.name}</h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{admin.user_id}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                        Admin
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <span className="text-xs font-bold">@</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">{admin.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <span className="text-xs font-bold">#</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">
                                            Mobile: {admin.mobile || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <span className="text-xs font-bold">D</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 underline underline-offset-4 decoration-slate-200 decoration-2">{admin.department}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                                    <button
                                        onClick={() => editAdmin(admin)}
                                        className="bg-purple-600 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition active:scale-[0.98] shadow-lg shadow-purple-100">
                                        Edit
                                    </button>
                                    <button onClick={() => deleteAdmin(admin._id)} className="bg-red-50 text-red-600 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition active:scale-[0.98]">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {
                        showPopup && (

                            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                                <div className="bg-white w-[95%] max-w-xl rounded-3xl p-8 shadow-2xl">

                                    <h2 className="text-2xl font-bold mb-6">
                                        {editingId ? "Edit Admin" : "Add New Admin"}
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <div className="relative pb-6">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Full Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition duration-150 ${errors.name ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-slate-200"
                                                    }`}
                                            />

                                            {errors.name && (
                                                <p className="absolute bottom-0 left-1 text-red-500 text-xs font-semibold">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>


                                        <div className="relative pb-6">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition duration-150 ${errors.email ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-slate-200"
                                                    }`}
                                            />

                                            {errors.email && (
                                                <p className="absolute bottom-0 left-1 text-red-500 text-xs font-semibold">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="relative pb-6">
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="Password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className={`border p-3 rounded-xl w-full pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition duration-150 ${errors.password ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-slate-200"
                                                        }`}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>

                                            {errors.password && (
                                                <p className="absolute bottom-0 left-1 text-red-500 text-xs font-semibold">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div className="relative pb-6">
                                            <input
                                                type="text"
                                                name="mobile"
                                                placeholder="Mobile Number"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className={`border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition duration-150 ${errors.mobile ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-slate-200"
                                                    }`}
                                            />

                                            {errors.mobile && (
                                                <p className="absolute bottom-0 left-1 text-red-500 text-xs font-semibold">
                                                    {errors.mobile}
                                                </p>
                                            )}
                                        </div>


                                        <div className="relative pb-6">
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                className={`border p-3 rounded-xl w-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition duration-150 ${errors.department ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-slate-200"
                                                    }`}
                                            >

                                                <option value="">Select Department</option>
                                                <option value="it">IT</option>
                                                <option value="csr">CSR</option>
                                                <option value="hr">HR</option>
                                                <option value="interior">Interior</option>
                                                <option value="sales">Sales</option>

                                                {departments.map((dept) => (
                                                    <option
                                                        key={dept._id}
                                                        value={dept.department_name}
                                                    >
                                                        {dept.department_name}
                                                    </option>
                                                ))}


                                            </select>

                                            {errors.department && (
                                                <p className="absolute bottom-0 left-1 text-red-500 text-xs font-semibold">
                                                    {errors.department}
                                                </p>
                                            )}
                                        </div>

                                        <div className="relative pb-6">
                                            <select
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                className={`border p-3 rounded-xl w-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition duration-150 ${errors.role ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-slate-200"
                                                    }`}
                                            >

                                                <option value="">Select Role</option>
                                                <option value="superadmin">Super Admin</option>
                                                <option value="admin">Admin</option>
                                                <option value="employee">Employee</option>
                                            </select>

                                            {errors.role && (
                                                <p className="absolute bottom-0 left-1 text-red-500 text-xs font-semibold">
                                                    {errors.role}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 mt-8">

                                        <button
                                            onClick={() => setShowPopup(false)}
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition duration-150"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={addAdmin}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition duration-150 shadow-lg shadow-purple-100"
                                        >
                                            {editingId ? "Update Admin" : "Submit"}
                                        </button>

                                    </div>

                                </div>

                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default AdminList;
