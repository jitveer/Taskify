const express = require("express");

const router = express.Router();


const {
    registerUser,
    getUsers,
    loginUser

} = require("../controllers/userController");


//Register User API
router.post("/register", registerUser);

// LOGIN USER
router.post("/login", loginUser);

//get all users
router.get("/", getUsers);


module.exports = router;