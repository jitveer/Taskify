const userRepository = require('../repositories/user.repository');
const taskAssignmentRepository = require('../repositories/taskAssignment.repository');

class SuperAdminService {
    async getDashboardStats() {
        const totalAdmins = await userRepository.countDocuments({ role: "admin" });
        const totalEmployees = await userRepository.countDocuments({ role: "employee" });
        const totalTasks = await taskAssignmentRepository.countDocuments({});
        const totalPending = await taskAssignmentRepository.countDocuments({ status: "Pending" });
        const totalInProgress = await taskAssignmentRepository.countDocuments({ status: "In Progress" });
        const totalCompleted = await taskAssignmentRepository.countDocuments({ status: "Completed" });

        // Calculate Overdue assignments (due date passed and not completed)
        const assignmentsWithDueDate = await taskAssignmentRepository.find({
            status: { $ne: "Completed" }
        });
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        let totalOverdue = 0;
        assignmentsWithDueDate.forEach(a => {
            if (a.taskId && a.taskId.dueDate) {
                const dDate = new Date(a.taskId.dueDate);
                dDate.setHours(0, 0, 0, 0);
                if (dDate < now) {
                    totalOverdue++;
                }
            }
        });

        const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

        return {
            totalAdmins,
            totalEmployees,
            totalTasks,
            totalPending,
            totalInProgress,
            totalCompleted,
            totalOverdue,
            completionRate
        };
    }
}

module.exports = new SuperAdminService();
