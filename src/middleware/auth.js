const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const auth = function(req,res,next){                   //checking whether the passed token is valid or not
    const token = req.header("token");
    if(!token) return res.status(401).json({data:{}, error:[], message:"Please login :(" })  
    try {
        const decoded = jwt.verify(token, "jwt-secret");
        req.user = decoded.user;
        next();        
    } catch (error) {
        console.log(error);
        res.status(403).json( {data:[], error:{}, message: "Invalid Token :( "} )
    }
}

module.exports = auth;