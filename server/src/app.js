import express from "express";

import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT;

//Middlewares
app.use(cors());
app.use(express.json());







//Test Routes
app.get('/', (req, res)=>{
    res.send("Backend Running");
})




app.listen(port, ()=>{
    console.log(`Server started at port ${port}`)
})


export default app;