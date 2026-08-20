const userRepository = require('../repositories/user.repository');

class UserService {
    // --- ADMIN LOGIC ---
    async getAdminLists() {
        return await userRepository.find({ role: 'admin' }, { excludePassword: true });
    }

    async addAdmin(adminData) {
        let nextUserId = 1000;
        if (adminData.role === "admin") {
            const lastUser = await userRepository.findOne(
                { role: "admin", user_id: { $gte: 1000, $lt: 2000 } },
                { sort: { user_id: -1 } }
            );
            nextUserId = lastUser ? Number(lastUser.user_id) + 1 : 1000;
        }
        adminData.user_id = nextUserId;
        return await userRepository.create(adminData);
    }

    async editAdmin(adminId, adminNewData) {
        const updateAdmin = await userRepository.findByIdAndUpdate(adminId, adminNewData, { new: true });
        if (!updateAdmin) {
            const error = new Error("Admin not found");
            error.statusCode = 404;
            throw error;
        }
        return updateAdmin;
    }

    async deleteAdmin(adminId) {
        const adminDelete = await userRepository.findByIdAndDelete(adminId);
        if (!adminDelete) {
            const error = new Error("Admin not found");
            error.statusCode = 404;
            throw error;
        }
        return adminDelete;
    }

    // --- EMPLOYEE LOGIC ---
    async addEmployee(employeeData, currentUser) {
        if (currentUser.role === "admin") {
            employeeData.department = currentUser.department;
        }

        let nextUserId = 2000;
        if (employeeData.role === "employee") {
            const lastUser = await userRepository.findOne(
                { role: "employee", user_id: { $gte: 2000 } },
                { sort: { user_id: -1 } }
            );
            nextUserId = lastUser ? Number(lastUser.user_id) + 1 : 2000;
        }

        employeeData.user_id = nextUserId;
        return await userRepository.create(employeeData);
    }

    async getEmployeeList(currentUser) {
        const filter = { role: "employee" };
        if (currentUser.role === "admin") {
            filter.department = currentUser.department;
        }
        return await userRepository.find(filter, { excludePassword: true });
    }

    async deleteEmployee(employeeId, currentUser) {
        const query = { _id: employeeId };
        if (currentUser.role === "admin") {
            query.department = currentUser.department;
        }

        const deleteEmployee = await userRepository.findOneAndDelete(query);
        if (!deleteEmployee) {
            const error = new Error("Employee not found or unauthorized");
            error.statusCode = 404;
            throw error;
        }
        return deleteEmployee;
    }

    async updateEmployee(employeeId, employeeUpdateData, currentUser) {
        const query = { _id: employeeId };
        if (currentUser.role === "admin") {
            query.department = currentUser.department;
        }

        const updateEmp = await userRepository.findOneAndUpdate(query, employeeUpdateData, { new: true });
        if (!updateEmp) {
            const error = new Error("User not found or unauthorized");
            error.statusCode = 404;
            throw error;
        }
        return updateEmp;
    }

    // --- SHARED / SUPERADMIN LOGIC ---
    async updateSelfProfile(userId, updateData) {
        const { name, email } = updateData;

        const updatedUser = await userRepository.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true }
        );

        if (!updatedUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const userObj = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
        delete userObj.password;

        return userObj;
    }

    async getAllUsersExceptSuperAdmin() {
        const allUsers = await userRepository.find({ role: { $ne: "superadmin" } }, { excludePassword: true });
        if (!allUsers) {
            const error = new Error("Did not get All Users");
            error.statusCode = 400;
            throw error;
        }
        return allUsers;
    }
}

module.exports = new UserService();
