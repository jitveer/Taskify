const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const superAdminController = require('../controllers/superAdminController');
const Users = require('../models/Users');



// Apply authentication and authorization middleware to all routes
// router.use(authMiddleware);

//  Dashboard Access
router.get("/dashboard", authMiddleware, authorize("superadmin"), superAdminController.adminLoginSuccess);




router.post("/addadmin", async (req, res) => {

    try {

        const adminData = req.body;
        const user_id = "";

        // VALIDATION
        if (adminData.name.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Name is too short"
            })
        }

        if (!(adminData.email.includes("@gmail.com"))) {
            return res.status(400).json({
                success: false,
                message: "This mail is not Valid"
            })
        }

        if (adminData.mobile.length !== 10) {
            return res.status(400).json({
                success: false,
                message: "Wrong Mobile Number"
            })
        }

        // if (adminData.role !== "admin") {
        //     return res.status(400).json({
        //         success: false,
        //         message: "this User role can't access"
        //     })
        // }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;
        if (!passwordRegex.test(adminData.password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }


        const userData = await Users.findOne({
            $or: [
                { email: adminData.email },
                { whatsapp_number: adminData.mobile }
            ]
        });

        if (userData) {
            return res.status(409).json({
                success: false,
                message: "User already exist"
            });
        }


        // ASSIGNING USERID BY BACEND

        let nextUserId;

        if (adminData.role === "admin") {
            const lastUser = await Users.findOne({ role: "admin", user_id: { $gte: 1000, $lt: 2000 } }).sort({ user_id: -1 });
            nextUserId = lastUser ? Number(lastUser.user_id) + 1 : 1000;
        } 
        
        if (adminData.role === "employee") {
            const lastUser = await Users.findOne({ role: "employee", user_id: { $gte: 2000 } }).sort({ user_id: -1 });
            nextUserId = lastUser ? Number(lastUser.user_id) + 1 : 2000;
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



})






module.exports = router;