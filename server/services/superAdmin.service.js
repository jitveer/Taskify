const userRepository = require('../repositories/user.repository');
const taskRepository = require('../repositories/task.repository');
const taskAssignmentRepository = require('../repositories/taskAssignment.repository');

class SuperAdminService {
    async getDashboardStats(loggedInUserId) {
        const totalAdmins = await userRepository.countDocuments({ role: "admin" });
        const totalEmployees = await userRepository.countDocuments({ role: "employee" });

        // Fetch tasks assigned by this Super Admin (matching "Tasks Assigned by Me" in /task-status)
        const taskFilter = loggedInUserId ? { assignedBy: loggedInUserId } : {};
        const allTasks = await taskRepository.find(taskFilter);
        const taskIds = allTasks.map(t => t._id);
        const allAssignments = await taskAssignmentRepository.find({ taskId: { $in: taskIds } });

        const assignmentsByTask = {};
        allAssignments.forEach(a => {
            const tId = (a.taskId?._id || a.taskId)?.toString();
            if (!assignmentsByTask[tId]) {
                assignmentsByTask[tId] = [];
            }
            assignmentsByTask[tId].push(a);
        });

        let totalCompleted = 0;
        let totalInProgress = 0;
        let totalPending = 0;
        let totalOverdue = 0;
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        allTasks.forEach(task => {
            const assignments = assignmentsByTask[task._id.toString()] || [];
            const isCompleted = assignments.length > 0 && assignments.every(a => (a.status || "").toLowerCase() === "completed");
            const hasInProgress = assignments.some(a => (a.status || "").toLowerCase() === "in progress");

            if (isCompleted) {
                totalCompleted++;
            } else if (hasInProgress) {
                totalInProgress++;
            } else {
                totalPending++;
            }

            if (!isCompleted && task.dueDate) {
                const dDate = new Date(task.dueDate);
                dDate.setHours(0, 0, 0, 0);
                if (dDate < now) {
                    totalOverdue++;
                }
            }
        });

        const totalTasks = allTasks.length;
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
