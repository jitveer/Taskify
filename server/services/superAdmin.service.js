const userRepository = require('../repositories/user.repository');
const taskAssignmentRepository = require('../repositories/taskAssignment.repository');

class SuperAdminService {
    async getDashboardStats() {
        const totalAdmins = await userRepository.countDocuments({ role: "admin" });
        const totalEmployees = await userRepository.countDocuments({ role: "employee" });
        const totalPending = await taskAssignmentRepository.countDocuments({ status: "Pending" });
        const totalCompleted = await taskAssignmentRepository.countDocuments({ status: "Completed" });

        return {
            totalAdmins,
            totalEmployees,
            totalPending,
            totalCompleted
        };
    }
}

module.exports = new SuperAdminService();
