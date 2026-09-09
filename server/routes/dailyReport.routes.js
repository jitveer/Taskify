const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');
const dailyReportController = require('../controllers/dailyReport.controller');

// All routes require authentication
router.use(authMiddleware);

// 1. Submit Daily Report (Admin only - accepts multiple file attachments)
router.post('/submit', authorize('admin', 'superadmin'), upload.array('attachments', 5), dailyReportController.submitDailyReport);

// 2. Get My Daily Reports (Admin viewing their own submitted history)
router.get('/my-reports', authorize('admin', 'superadmin'), dailyReportController.getMyDailyReports);

// 3. Get All Daily Reports (Super Admin view with filters)
router.get('/all', authorize('superadmin'), dailyReportController.getAllDailyReports);

module.exports = router;
