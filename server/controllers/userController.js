const User = require("../models/Users");

//Register User
const registerUser = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        //check existing user
        const existinUser = await User.findOne({ email });

        if (existinUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Split name into first_name and last_name
        const nameParts = name ? name.trim().split(/\s+/) : ["User"];
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(" ") || "";

        // Generate user_id if not present
        const user_id = req.body.user_id || "SA-" + Date.now();

        //Create new user
        const newUser = await User.create({
            user_id,
            first_name,
            last_name,
            email,
            password,
            role: role || "superadmin"
        });

        res.status(201).json({

            message: "User Registered Successfully",
            user: newUser
        });
    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // CHECK USER
        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        // CHECK PASSWORD
        if (user.password !== password) {

            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        // SUCCESS
        res.status(200).json({

            message: "Login Successful",

            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};



//Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);

    }

    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    registerUser,
    getUsers,
    loginUser
};