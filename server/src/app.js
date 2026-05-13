const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT;



//Middlewares
app.use(cors());
app.use(express.json());






//Test Routes
app.get('/', (req, res)=>{
    res.send("Backend Running");
})



module.exports = app;