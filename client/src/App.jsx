import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import SuperAdminLogin from "./pages/auth/SuperAdminLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import AdminList from "./pages/superadmin/AdminList";
import AssignTask from "./pages/superadmin/AssignTask";
import EmployeeList from "./pages/superadmin/EmployeeList";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEmployeeList from "./pages/admin/AdminEmployeeList";
import AdminAssignTask from "./pages/admin/AdminAssignTask";
import AdminMyTasks from "./pages/admin/AdminMyTasks";
import AdminTaskStatus from "./pages/admin/AdminTaskStatus";
import AdminReports from "./pages/admin/AdminReports";


import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyTasks from "./pages/superadmin/MyTasks";
import TaskStatus from "./pages/superadmin/TaskStatus";
import Reports from "./pages/superadmin/Reports";


function App() {
  return (


    <BrowserRouter>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home />} />


        {/*Login */}
        <Route
          path="/super-admin-login"
          element={<SuperAdminLogin />} />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/employee-login"
          element={<EmployeeLogin />}
        />



        {/* Dashboard */}
        <Route
          path="/super-admin-dashboard"
          element={<SuperAdminDashboard />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/employee-dashboard"
          element={<EmployeeDashboard />}
        />


        <Route
          path="/admin-list"
          element={<AdminList />}
        />

        <Route
          path="/employee-list"
          element={<EmployeeList />}
        />

        <Route
          path="/admin-employee-list"
          element={<AdminEmployeeList />}
        />

        <Route
          path="/admin-assign-task"
          element={<AdminAssignTask />}
        />

        <Route
          path="/assign-task"
          element={<AssignTask />}
        />

        <Route
          path="/my-tasks"
          element={<MyTasks />}
        />

        <Route
          path="/task-status"
          element={<TaskStatus />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/admin-my-tasks"
          element={<AdminMyTasks />}
        />

        <Route
          path="/admin-task-status"
          element={<AdminTaskStatus />}
        />

        <Route
          path="/admin-reports"
          element={<AdminReports />}
        />

        <Route
          path="/admin-my-tasks"
          element={<AdminMyTasks />}
        />

        <Route
          path="/admin-task-status"
          element={<AdminTaskStatus />}
        />

        <Route
          path="/admin-reports"
          element={<AdminReports />}
        />

   

    </Routes>

    </BrowserRouter >
  )
}

export default App;