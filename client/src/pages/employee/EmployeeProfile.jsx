import { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import Swal from "sweetalert2";
import { User, Mail, Briefcase, Shield, Edit2, Check } from "lucide-react";
import axios from "axios";

function EmployeeProfile() {
    const menuItems = [
        { name: "Dashboard", path: "/employee-dashboard" },
        { name: "My Tasks", path: "/employee-my-tasks" },
        { name: "Reports", path: "/employee-reports" },
        { name: "My Profile", path: "/employee-profile" }
    ];

    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) || {};
    });

    const [formData, setFormData] = useState({
        name: currentUser.name || currentUser.employee_name || "",
        email: currentUser.email || "",
        role: currentUser.role || "Employee",
        department: currentUser.department || "N/A"
    });

    useEffect(() => {
        setFormData({
            name: currentUser.name || currentUser.employee_name || "",
            email: currentUser.email || "",
            role: currentUser.role || "Employee",
            department: currentUser.department || "N/A"
        });
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim()) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Name and Email cannot be empty!",
            });
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/employee/update-profile`,
                { name: formData.name, email: formData.email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.success) {
                const updatedUser = {
                    ...currentUser,
                    ...response.data.user
                };

                localStorage.setItem("user", JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
                setIsEditing(false);

                // Notify other components (like Header)
                window.dispatchEvent(new Event("profileUpdated"));

                Swal.fire({
                    icon: "success",
                    title: "Profile Updated",
                    text: "Your profile has been successfully updated!",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error("Update profile error:", error);
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.response?.data?.message || "Failed to update profile in database."
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            <Sidebar role="Employee" menuItems={menuItems} color="emerald" />

            <div className="flex-1 min-h-screen w-full overflow-hidden">
                <Header title="My Profile" name="Employee" role="Employee" />

                <div className="p-4 md:p-8 lg:p-10 max-w-3xl mx-auto pb-24 md:pb-10">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                        {/* Banner */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-16 md:h-48 relative flex items-end justify-center md:justify-start px-6 pb-6 md:pb-8">
                            <div className="absolute -bottom-12 md:-bottom-16 left-1/2 md:left-10 transform -translate-x-1/2 md:translate-x-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex justify-center items-center text-4xl md:text-5xl font-bold border-4 border-white shadow-lg select-none">
                                {(formData.name || "U").charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="pt-16 md:pt-6 md:pl-48 px-6 pb-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 text-center md:text-left">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                                        {formData.name || "User"}
                                    </h2>
                                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mt-1">
                                        {formData.role}
                                    </p>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="self-center md:self-auto py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-100"
                                    >
                                        <Edit2 size={14} /> Edit Profile
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSave} className="mt-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <User size={13} className="text-emerald-500" /> Full Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition font-medium"
                                                placeholder="Enter full name"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                                {formData.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Mail size={13} className="text-emerald-500" /> Email Address
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition font-medium"
                                                placeholder="Enter email address"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                                {formData.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Department */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Briefcase size={13} className="text-slate-400" /> Department
                                        </label>
                                        <p className="text-sm font-semibold text-slate-500 bg-slate-50/50 px-4 py-3 rounded-xl border border-slate-100 select-none">
                                            {formData.department}
                                        </p>
                                    </div>

                                    {/* Role */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Shield size={13} className="text-slate-400" /> Role
                                        </label>
                                        <p className="text-sm font-semibold text-slate-500 bg-slate-50/50 px-4 py-3 rounded-xl border border-slate-100 select-none">
                                            {formData.role}
                                        </p>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-200"
                                        >
                                            <Check size={14} /> Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeProfile;
