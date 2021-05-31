const express=require("express");
const bodyparser=require("body-parser");
const validator = require("express-validator");

const initMongo = require("./config/mongodb");            // getting connected with mongoDb config       
initMongo();  


const User = require("./schemas/User");
const userRoute = require("./routs/user");                // getting routs from routs folder
const app=express();
app.use(bodyparser.json());                               // Basic body parser syntaxes
app.use(bodyparser.urlencoded({extended:true}));

const PORT = 4000;

app.get("/",(req,res)=>{
    res.send("Welcome to user Api")
})
app.get("/about",async(req,res)=>{
    try {
        const getuser =await User.find().sort({"firstName":1});
        res.send(getuser)

       
    } catch (error) {
        res.status(400).send(error)
    }
})

app.use("/api/user", userRoute);                           // Using the created middlewares


app.use((err,req,res,next)=>{
    console.log(err);
    return res.send('error happened 2');
});


app.listen(PORT,(req,res)=>{
    console.log(`https://localhost:${PORT}`);
})