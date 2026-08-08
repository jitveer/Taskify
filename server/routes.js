const express = require('express');
const router = express.Router();

// Import feature routes
const authRoutes = require('./routes/authRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require('./routes/employeeRoutes');



// Mount routes
router.use('/auth', authRoutes);
router.use('/superadmin', superAdminRoutes);
router.use('/admin', adminRoutes);
// router.use('/employee', employeeRoutes);




module.exports = router;