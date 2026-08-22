const express = require('express');
const router = express.Router();
const { authLogin, subscribePush } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post("/super-admin/login", authLogin);
router.post("/admin/login", authLogin);
router.post("/employee/login", authLogin);

router.post("/subscribe", authMiddleware, subscribePush);

module.exports = router;