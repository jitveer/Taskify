const express = require('express');
const router = express.Router();

// Import feature routes
const authRoutes = require('./routes/auth.routes');
const superAdminRoutes = require('./routes/superAdmin.routes');
const adminRoutes = require('./routes/admin.routes');
const employeeRoutes = require('./routes/employee.routes');



// Mount routes
router.use('/auth', authRoutes);

router.use('/superadmin', superAdminRoutes);
router.use('/admin', adminRoutes);
router.use('/employee', employeeRoutes);




module.exports = router;