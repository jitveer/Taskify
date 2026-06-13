const express = require("express");
const Users = require("../models/Users");
const taskTabel = require("../models/Tasks");
const router = express.Router();









const adminLoginSuccess = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "authmiddleware working"
    })
}




// ALL USERS

const allUser = async (req, res) => {

    try {
        const allUsers = await Users.find({ role: { $ne: "superadmin" } }).select("-password");

        if (!allUsers) {
            return res.status(400).json({
                success: false,
                message: "Did not get All Users"
            })
        }

        return res.status(200).json({
            success: true,
            count: allUsers.length,
            users: allUsers
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}











// ADD ADIMIN

const addAdmin = async (req, res) => {

    let nextUserId;

    try {
        const adminData = req.body;
        const user_id = "";

        // ASSIGNING USERID BY BACEND

        let nextUserId;

        if (adminData.role === "admin") {
            const lastUser = await Users.findOne({ role: "admin", user_id: { $gte: 1000, $lt: 2000 } }).sort({ user_id: -1 });
            nextUserId = lastUser ? Number(lastUser.user_id) + 1 : 1000;
        }

        adminData.user_id = nextUserId;

        // SAVE NEW USER
        const newUser = await Users.create(adminData);
        return res.status(200).json({
            success: true,
            message: "New User Added",
            data: newUser
        })

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}




// ADMIN LIST

const adminLists = async (req, res) => {
    try {
        const allAdmins = await Users.find({ role: 'admin' }).select("-password");
        if (allAdmins) {
            return res.status(200).json({
                success: true,
                admins: allAdmins
            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}


// EDIT ADMIN

const editAdmin = async (req, res) => {
    try {

        const adminId = req.params.id;
        const adminNewData = req.body;

        const updateAdmin = await Users.findByIdAndUpdate(adminId, adminNewData, { new: true });


        if (!updateAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin Updated"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


// DELETE ADMIN

const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        const adminDelete = await Users.findByIdAndDelete(adminId);

        if (!adminDelete) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin Deleted"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



















// ADD EMPLOYEE

const addEmployee = async (req, res) => {
    try {
        const employeeData = req.body;
        const user_id = "";

        // ASSIGNIG USERID BY BACKEND

        let nextUserId;

        if (employeeData.role === "employee") {
            const lastUser = await Users.findOne({ role: "employee", user_id: { $gte: 2000 } }).sort({ user_id: -1 });
            nextUserId = lastUser ? Number(lastUser.user_id) + 1 : 2000;
        }

        employeeData.user_id = nextUserId;

        const newEmployee = await Users.create(employeeData);

        return res.status(200).json({
            success: true,
            message: "Employee added successfuly",
            data: newEmployee
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Employee not added, ${error.message} `
        })
    }
}



// EMPLOYEE LIST

const employeeList = async (req, res) => {

    try {
        const employeeList = await Users.find({ role: "employee" }).select("-password");

        if (!employeeList) {
            return res.status(400).json({
                success: false,
                message: "Emloyee list is not visible"
            })
        }

        return res.status(200).json({
            success: true,
            employees: employeeList
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Employee List Api Not Worked"
        })
    }
}



// DELETE EMPLOYEE

const employeeDelete = async (req, res) => {

    try {
        const employeeId = req.params.id;
        console.log(employeeId)

        const deleteEmployee = await Users.findByIdAndDelete(employeeId);

        if (!deleteEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee Deleted"
        });



    } catch (e) {
        return res.status(200).json({
            success: false,
            message: e.message
        })
    }

}




// UPDATE EMPLOYEE DETAILS

const employeeUpdate = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employeeUpdate = req.body;

        const updateEmp = await Users.findByIdAndUpdate(employeeId, employeeUpdate, { new: true });

        if (!updateEmp) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Admin Updated",
            user: updateEmp
        });

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}











//ADD TASKS

const addTask = async (req, res) => {
    try {
        const taskData = req.body;

        // 1. Array Parsing: FormData की वजह से 'assignedTo' string बन जाता है, उसे वापस array में बदलना
        if (taskData.assignedTo && typeof taskData.assignedTo === "string") {
            try {
                taskData.assignedTo = JSON.parse(taskData.assignedTo);
            } catch (error) {
                // अगर JSON.parse फेल हो जाता है (जैसे सिंगल ID भेजी गई हो), तो उसे एरे में रैप कर दें
                taskData.assignedTo = [taskData.assignedTo];
            }
        }

        // 2. Attachments Handling: अपलोडेड फ़ाइल्स को attachments array में मैप करना
        if (req.files && req.files.length > 0) {
            taskData.attachments = req.files.map(file => {
                return {
                    fileName: file.originalname, // असली नाम जैसे 'my_document.pdf'
                    fileUrl: `/uploads/${file.filename}` // static path जैसे '/uploads/171784918239-file.pdf'
                };
            });
        }

        // 3. Database Entry: टास्क को सेव करना
        const newTask = await taskTabel.create(taskData);

        if (!newTask) {
            return res.status(400).json({
                success: false,
                message: "Adding Task Failed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task Successfully Added",
            task: newTask // रिस्पॉन्स में टास्क डेटा भेजना
        });

    } catch (e) {
        console.error("Error adding task:", e);
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }
};








// const addTask = async (req, res) => {

//     try {
//         const taskData = req.body;
//         const newTask = await taskTabel.create(taskData);

//         if (!newTask) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Adding Task Failed"
//             })
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Task Sccefully Added"
//         })

//     } catch (e) {
//         return res.status(400).json({
//             success: false,
//             message: e.message
//         })
//     }
// }








const taskList = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const taskLists = await taskTabel.find({ assignedBy: loggedInUserId }).populate("assignedTo", "name user_id");

        if (taskLists) {
            return res.status(200).json({
                success: true,
                message: "Successfully got Task List",
                assignedTasks: taskLists
            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to get tasks"
        })
    }
}







module.exports = { adminLoginSuccess, allUser, addAdmin, adminLists, editAdmin, deleteAdmin, addEmployee, employeeList, employeeDelete, employeeUpdate, addTask, taskList };