import axios from "axios";

// Reusable Axios instance with base URL resolution
const api = axios.create({
    baseURL: (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/+$/, ""),
});

// Centralized interceptor to automatically attach authorization tokens
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Unified error normalization interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const errorData = {
            success: false,
            status: error.response?.status || 500,
            message: error.response?.data?.message || "An unexpected error occurred",
            errors: error.response?.data?.errors || null
        };
        return Promise.reject(errorData);
    }
);

// Centralized API endpoints functions
export const authApi = {
    login: async (email, password, role) => {
        let path = "/api/auth/employee/login";
        if (role === "admin") path = "/api/auth/admin/login";
        if (role === "superadmin") path = "/api/auth/super-admin/login";

        return api.post(path, { email, password, role });
    }
};

export const taskApi = {
    // Employee endpoints
    getMyTasks: async () => {
        return api.get("/api/employee/my-tasks");
    },

    updateAssignmentStatus: async (assignmentId, data) => {
        if (data instanceof FormData) {
            return api.patch(`/api/employee/update-status/${assignmentId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        }
        return api.patch(`/api/employee/update-status/${assignmentId}`, data);
    },

    // Admin endpoints
    createAdminTask: async (taskFormData) => {
        // Accepts FormData for files attachments
        return api.post("/api/admin/addTask", taskFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    },

    getAdminTasks: async () => {
        return api.get("/api/admin/taskList");
    },

    // Super Admin endpoints
    createSuperAdminTask: async (taskFormData) => {
        return api.post("/api/superadmin/addTask", taskFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    },

    getSuperAdminTasks: async () => {
        return api.get("/api/superadmin/taskList");
    },

    // General user queries
    getAllUsers: async (apiPrefix) => {
        return api.get(`${apiPrefix}/allUser`);
    }
};

export const dailyReportApi = {
    // Admin: Submit a new daily work report with attachments
    submitReport: async (reportFormData) => {
        return api.post("/api/reports/submit", reportFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    },

    // Admin: Get history of my submitted reports
    getMyReports: async () => {
        return api.get("/api/reports/my-reports");
    },

    // Super Admin: Get all daily reports with optional query filters
    getAllReports: async (params = {}) => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== "" && v !== "All")
        );
        const queryString = new URLSearchParams(cleanParams).toString();
        return api.get(`/api/reports/all${queryString ? `?${queryString}` : ''}`);
    }
};
