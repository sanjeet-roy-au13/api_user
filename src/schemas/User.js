const mongoose = require("mongoose");

const userSchema = mongoose.Schema({                   // Basic schema (structure) for one document
    firstName : String,
    lastname : String,
    email : String,
    password : String,
    about:String,
    createdDate : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model("user", userSchema);   // one schema is going to use for all documents