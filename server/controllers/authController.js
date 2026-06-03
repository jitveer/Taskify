const User = require('../models/Users');
const generatetoken = require('../utils/generateToken');


// SUPERADMIN LOGIN
const authLogin = async(req, res)=>{
    try{
        const {email, password, role} = req.body;

        // User Find
        const user = await User.findOne({email});

        //user check
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }

        //password check
        if(password != user.password){
            return res.status(403).json({
                success: false,
                message:"Invalid Details",
            })
        }

        //role verify
        if(role != user.role){
            return res.status(403).json({
                success: false,
                message: "Invalid role"
            })
        }


        //generate token
        const token = generatetoken(user._id, user.role )

        return res.status(200).json({
            success: true,
            message:"login Successful",
            token,
            user:{
                id: user._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role,
            }
        })        
        
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: e.message,
        })
    }
}





module.exports = {authLogin};