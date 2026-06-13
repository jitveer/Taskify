import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import EmployeeTable from "../../components/layout/EmployeeTable";
import axios from "axios";

function AdminEmployeeList() {
    const [employees, setEmployees] = useState([]);

    const menuItems = [
        { name: "Dashboard", path: "/admin-dashboard" },
        { name: "Employee List", path: "/admin-employee-list" },
        { name: "Add Task", path: "/admin-assign-task" },
        { name: "My Tasks", path: "/admin-my-tasks" },
        { name: "Tasks Assigned by Me", path: "/admin-task-status" },
        { name: "Reports", path: "/admin-reports" }
    ];

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/employees`);
            setEmployees(response.data);
        } catch (error) {
            console.log("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar role="Admin" menuItems={menuItems} color="blue" />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full overflow-hidden">
                {/* Header */}
                <Header title="Employee Directory" role="Admin" />

                {/* Admin Employee Table */}
                <EmployeeTable color="blue" employees={employees} />
            </div>
        </div>
    );
}

export default AdminEmployeeList;
