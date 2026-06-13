const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const router = express.Router();


router.use(authMiddleware);
router.use(authorize('admin'));


module.exports = router;