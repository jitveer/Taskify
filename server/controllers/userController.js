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

        //Create new user
        const newUser = await User.create({
            name,
            email,
            password,
            role
        });

        res.status(201).json({

            message: "User Registerd Successfully",
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