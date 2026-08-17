const taskRepository = require("../repositories/taskRepository");
const taskAssignmentRepository = require("../repositories/taskAssignmentRepository");
const taskHistoryRepository = require("../repositories/taskHistoryRepository");
const User = require("../models/Users");

class TaskService {
    async createTask(taskData, assigneeIds, creator) {
        if (!assigneeIds || assigneeIds.length === 0) {
            throw new Error("At least one assignee is required.");
        }

        // Set creator as assignedBy
        taskData.assignedBy = creator.id;

        // Verify and load assignees to validate existence, department, and role
        const assignees = await User.find({ _id: { $in: assigneeIds } });
        if (assignees.length !== assigneeIds.length) {
            throw new Error("One or more assigned employees do not exist.");
        }

        // Validate assignee roles
        for (const emp of assignees) {
            if (emp.role !== "employee") {
                throw new Error(`User ${emp.name} is not an employee and cannot be assigned tasks.`);
            }
            // If creator is admin, verify department match
            if (creator.role === "admin" && emp.department !== creator.department) {
                throw new Error(`Admin cannot assign tasks to employee ${emp.name} from a different department.`);
            }
        }

        // For group tasks, check if task department is specified
        if (taskData.taskType === "group_task" && !taskData.department) {
            if (creator.role === "admin") {
                taskData.department = creator.department;
            } else {
                throw new Error("Department is required for group tasks.");
            }
        }

        // Create the task record
        const task = await taskRepository.create(taskData);

        // Generate assignments
        const assignments = [];
        for (const emp of assignees) {
            // Determine assignment department (use task department for group tasks, or assignee department)
            const dept = taskData.taskType === "group_task" ? taskData.department : emp.department;

            const assignment = await taskAssignmentRepository.create({
                taskId: task._id,
                assigneeId: emp._id,
                assignedBy: creator.id,
                department: dept,
                dueDate: task.dueDate,
                status: "Pending"
            });
            assignments.push(assignment);
        }

        // Record history log
        await taskHistoryRepository.create({
            taskId: task._id,
            actorId: creator.id,
            action: "CREATED",
            oldValue: null,
            newValue: task.title,
            source: "WEB",
            metadata: { assigneeCount: assigneeIds.length }
        });

        return { task, assignments };
    }
}

module.exports = new TaskService();
