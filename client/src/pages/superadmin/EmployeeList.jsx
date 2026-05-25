import { useEffect, useState } from "react";

import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import EmployeeTable from "../../components/layout/EmployeeTable";

import axios from "axios";

function EmployeeList() {

    const [employees, setEmployees] = useState([]);

    const menuItems = [
        { name: "Dashboard", path: "/super-admin-dashboard" },
        { name: "Admin List", path: "/admin-list" },
        { name: "Employee List", path: "/employee-list" },
        { name: "Assign Task", path: "/assign-task" },
        { name: "My Tasks", path: "/my-tasks" },
        { name: "Task Status", path: "/task-status" },
        { name: "Reports", path: "/reports" }
    ];


    // FETCH EMPLOYEES
    const fetchEmployees = async () => {

        try {

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/employees`
            );

            console.log(response.data);

            setEmployees(response.data);

        } catch (error) {

            console.log(error);
        }
    };


    useEffect(() => {

        fetchEmployees();

    }, []);


    return (
        <div className="flex flex-col lg:flex-row bg-[#f8fafc] min-h-screen font-sans text-slate-800">

            {/* Sidebar */}
            <Sidebar
                role="Super Admin"
                menuItems={menuItems}
                color="purple"
            />

            {/* Main Content */}
            <div className="flex-1 min-h-screen w-full overflow-hidden">

                {/* Header */}
                <Header
                    title="Employee Directory"
                    name="Super Admin"
                    role="Super Admin"
                />

                {/* Employee Table */}
                <EmployeeTable
                    color="purple"
                    employees={employees}
                />

            </div>
        </div>
    );
}

export default EmployeeList;