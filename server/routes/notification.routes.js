const express = require('express');
const router = express.Router();
const { getNotifications, toggleRead, markAllAsRead, clearAll } = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, getNotifications);
router.put('/:id/toggle-read', authMiddleware, toggleRead);
router.put('/mark-all-read', authMiddleware, markAllAsRead);
router.delete('/clear-all', authMiddleware, clearAll);

module.exports = router;
