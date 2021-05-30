const mongoose = require("mongoose");
const mongouri = "mongodb+srv://admin:sanchit111...@cluster0.hgdc9.mongodb.net/User_api?retryWrites=true&w=majority";

const initMongo = async()=>{
    try {
        await mongoose.connect(mongouri,{
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log("Mongo DB connection established.")
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = initMongo;


