const mongoose = require("mongoose")
require("dotenv").config()

const url = process.env.MONGODB_URL || "mongodb://0.0.0.0:27017/chatapp"

const connectToDB = async ()=>{
    try{
        await mongoose.connect(url)
        console.log(`Connected With MongoDB DataBase ${url}`);
    }
    catch(err){
        console.log(err);
    }
}

module.exports = connectToDB