const express = require('express');
const router = express.Router();

// Import feature routes
const authRoutes = require('./routes/auth.routes');
const superAdminRoutes = require('./routes/superAdmin.routes');
const adminRoutes = require('./routes/admin.routes');
const employeeRoutes = require('./routes/employee.routes');
const notificationRoutes = require('./routes/notification.routes');



// Mount routes
router.use('/auth', authRoutes);

router.use('/superadmin', superAdminRoutes);
router.use('/admin', adminRoutes);
router.use('/employee', employeeRoutes);
router.use('/notifications', notificationRoutes);




module.exports = router;