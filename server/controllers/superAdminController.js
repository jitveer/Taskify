const express = require("express");
const router = express.Router();


const adminLoginSuccess = (req, res)=>{
    return res.status(200).json({
        success: true,
        message: "authmiddleware working"
    })
}

module.exports = {adminLoginSuccess};