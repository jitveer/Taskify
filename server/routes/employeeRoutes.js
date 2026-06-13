const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");


router.use(authMiddleware);
router.use(authorize('employee'));

// router.get("/", getEmployees);


module.exports = router;