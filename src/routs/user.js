const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../schemas/User");
const auth = require("../middleware/auth");



router.post(
    "/signup",
    [
        check("firstName","Please enter the first name !").not().isEmpty(),
        check("lastname","Please enter the last name !").not().isEmpty(),
        check("email","Please enter the Email ID !").isEmail(),
        check("password","Please enter the Password !!").isLength({min:5}),
        check("about","Please enter the Email ID !").not().isEmpty(),
        
    
    ],
    async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){                                               // error in validation
            return res.status(400).json({
                data: {},
                errors : errors.array(),
                message : "Unable to create user :("
            })
        }
        try {
            let user = await User.findOne({email:req.body.email});
            if (user){                                                        // for an alreadt exists user
                return res.status(400).json({
                    data: {},
                    errors :[{
                        value: req.body.email,                                // same format in postman
                        msg:"User already exists here :(",
                        paran:"email",
                        location:"body"
                    }],
                    message : "Unable to create user :("
                })
            }
            user = new User({                                                // sending datas to schema for a new user
                firstName : req.body.firstName,                              
                lastname : req.body.lastname,
                email : req.body.email,
                about: req.body.about,
                profilepicture:req.body.profilepicture
            });
            const salt = await bcrypt.genSalt(8);                             // password encryption
            user.password = await bcrypt.hash(req.body.password, salt);
            await user.save();
            res.status(200).send({
                data: user,
                errors:[],
                message:"User registration was sucessfull :)"
            });

        } catch (error) {
            console.log(error.message);                                       // Developer Error
            res.status(500).send("ERROR IN SAVING :(");
        }

});

router.post(
    "/login",
    [
        check("email","Please enter the Email ID !").isEmail(),
        check("password","Please enter the Password !!").not().isEmpty()

    ],
    async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){                                               // error in validation for login
            return res.status(400).json({
                data: {},
                errors : errors.array(),
                message : "Unable to login :("
            });
        }

        try {
        let user = await User.findOne({email:req.body.email});              // checks if user is exists in database
        if(!user){
            return res.status(400).json({
                data: {},
                errors :[{
                    value:req.body.email,
                    msg:"User doesnot exists :(",
                    param:"email",
                    location:"body"
                }],
                message : "Unable to login :("
            });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);   // password validation
        if(!isMatch){
            return res.status(400).json({
                data: {},
                errors :[{
                    value:req.body.password,
                    msg:"User Incorrect Password :(",
                    param:"Password",
                    location:"Password"
                }],
                message : "Unable to login :("
            });    
        }
        jwt.sign(                                                       // jason web token genarating
            {user:{id:user.id}},
            "jwt-secret",
            (error,token)=>{
                if(error) throw error;
                res.status(200).json({
                    data:{token},
                    errors:[],
                    message:"Login success :)"
                })
            }
        )
    } catch (error) {
        console.log(error.message);                                       // Developer Error
        res.status(500).send("ERROR IN LOGIN :( ");
            
    }
    }
);

router.post("/about",
    auth,                  // passing authantication                                                    
    async (req,res)=>{
        try {
            const user = await User.findById(req.user.id);
            res.json({
                data:user,
                errors:[],
                message:"You are in Dashboard :)"
            })
        } catch (error) {
            res.send("ERROR IN FETCHING :( ")            
        }
    }
);

module.exports = router;