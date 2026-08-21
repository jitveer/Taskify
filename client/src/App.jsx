import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import NotFound from "./pages/NotFound";
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
import EmployeeMyTasks from "./pages/employee/EmployeeMyTasks";
import EmployeeTaskStatus from "./pages/employee/EmployeeTaskStatus";
import EmployeeReports from "./pages/employee/EmployeeReports";
import EmployeeProfile from "./pages/employee/EmployeeProfile";


import MyTasks from "./pages/superadmin/MyTasks";
import TaskStatus from "./pages/superadmin/TaskStatus";
import Reports from "./pages/superadmin/Reports";
import Notifications from "./components/layout/notification";




function App() {
  return (


    <BrowserRouter>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />


        {/* ------------------------------------------------------- */}
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



        {/* ------------------------------------------------------- */}
        {/* Dashboard */}
        <Route
          path="/super-admin-dashboard"
          element={
            <ProtectedRoute
              loginPath="/super-admin-login"
              allowedRole="superadmin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              loginPath="/admin-login"
              allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute
              loginPath="/employee-login"
              allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              loginPath="/"
              allowedRole="employee"
            >
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* ------------------------------------------------------- */}
        {/*Super Admin Routes*/}

        <Route
          path="/admin-list"
          element={
            <ProtectedRoute
              loginPath="/super-admin-login"
              allowedRole="superadmin">
              <AdminList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-list"
          element={
            <ProtectedRoute
              loginPath="/super-admin-login"
              allowedRole="superadmin">
              <EmployeeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assign-task"
          element={
            <ProtectedRoute
              loginPath="/super-admin-login"
              allowedRole="superadmin">
              <AssignTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute
              loginPath="/super-admin-login"
              allowedRole="superadmin">
              <MyTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/task-status"
          element={
            <ProtectedRoute
              loginPath="/super-admin-login"
              allowedRole="superadmin">
              <TaskStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute
              loginPath="/super-admin-login"
              allowedRole="superadmin">
              <Reports />
            </ProtectedRoute>
          }
        />




        {/* ------------------------------------------------------- */}
        {/* Admin Routes*/}

        <Route
          path="/admin-employee-list"
          element={
            <ProtectedRoute
              loginPath="/admin-login"
              allowedRole="admin">
              <AdminEmployeeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-assign-task"
          element={
            <ProtectedRoute
              loginPath="/admin-login"
              allowedRole="admin">
              <AdminAssignTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-my-tasks"
          element={
            <ProtectedRoute
              loginPath="/admin-login"
              allowedRole="admin">
              <AdminMyTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-task-status"
          element={
            <ProtectedRoute
              loginPath="/admin-login"
              allowedRole="admin">
              <AdminTaskStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-reports"
          element={
            <ProtectedRoute
              loginPath="/admin-login"
              allowedRole="admin">
              <AdminReports />
            </ProtectedRoute>
          }
        />




        {/* ------------------------------------------------------- */}
        {/* Employee routes */}

        <Route
          path="/employee-my-tasks"
          element={
            <ProtectedRoute
              loginPath="/employee-login"
              allowedRole="employee">
              <EmployeeMyTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-task-status"
          element={
            <ProtectedRoute
              loginPath="/employee-login"
              allowedRole="employee">
              <EmployeeTaskStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-reports"
          element={
            <ProtectedRoute
              loginPath="/employee-login"
              allowedRole="employee">
              <EmployeeReports />
            </ProtectedRoute>
          }
        />


        <Route
          path="/employee-profile"
          element={
            <ProtectedRoute
              loginPath="/employee-login"
              allowedRole="employee">
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />



      </Routes>

    </BrowserRouter >
  )
}

export default App;