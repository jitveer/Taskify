const express = require('express');
const router = express.Router();
const { authLogin } = require('../controllers/authController');


router.post("/super-admin/login", authLogin);
router.post("/admin/login", authLogin);
router.post("/employee/login", authLogin);


module.exports = router;