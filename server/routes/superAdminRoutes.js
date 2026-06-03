const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const superAdminController = require('../controllers/superAdminController');
const Users = require('../models/Users');
const addAdminValidation = require('../middlewares/addAdminValidation');



// Apply authentication and authorization middleware to all routes
router.use(authMiddleware);
router.use(authorize('superadmin'))

// Dashboard Access
router.get("/dashboard", superAdminController.adminLoginSuccess);
router.post("/addadmin", addAdminValidation, superAdminController.addAdmin);
router.get('/adminLists', superAdminController.adminLists);
router.patch('/adminLists/:id', superAdminController.editAdmin);
router.delete('/adminLists/:id', superAdminController.deleteAdmin);
router.get('/addEmployee', superAdminController.addEmployee);







module.exports = router;