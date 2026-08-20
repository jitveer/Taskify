const express = require('express');
const router = express.Router();
const { authLogin } = require('../controllers/auth.controller');


router.post("/super-admin/login", authLogin);
router.post("/admin/login", authLogin);
router.post("/employee/login", authLogin);


module.exports = router;