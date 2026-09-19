const express = require('express');
const router = express.Router();
const { authLogin, subscribePush } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

router.post("/super-admin/login", authLimiter, authLogin);
router.post("/admin/login", authLimiter, authLogin);
router.post("/employee/login", authLimiter, authLogin);

router.post("/subscribe", authMiddleware, subscribePush);

module.exports = router;