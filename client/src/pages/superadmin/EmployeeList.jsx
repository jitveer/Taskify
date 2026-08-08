import { useEffect, useState } from "react";

import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import EmployeeTable from "../../components/layout/EmployeeTable";

import axios from "axios";

function EmployeeList() {

    const [employees, setEmployees] = useState([
        // {
        //     _id: "1",
        //     user_id: "EMP001",
        //     name: "John Doe",
        //     email: "john@gmail.com",
        //     mobile: "9876543210",
        //     department: "IT"
        // },
        // {
        //     _id: "2",
        //     user_id: "EMP002",
        //     name: "Sarah Smith",
        //     email: "sarah@gmail.com",
        //     mobile: "9876541230",
        //     department: "HR"
        // }
    ]);

    const menuItems = [
        { name: "Dashboard", path: "/super-admin-dashboard" },
        { name: "Admin List", path: "/admin-list" },
        { name: "Employee List", path: "/employee-list" },
        { name: "Add Task", path: "/assign-task" },
        // { name: "Task List", path: "/my-tasks" },
        { name: "Tasks Assigned by Me", path: "/task-status" },
        { name: "Reports", path: "/reports" }
    ];


    // FETCH EMPLOYEES
    const fetchEmployees = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/superadmin/employeeList`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Employee API Response:", response.data);
            console.log("Is Array?", Array.isArray(response.data));

            setEmployees(response.data.employees);

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
                    apiPrefix="/api/superadmin"
                />

            </div>
        </div>
    );
}

export default EmployeeList;