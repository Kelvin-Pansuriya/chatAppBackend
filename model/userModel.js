const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        min:4,
        max:16
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:50
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    isAvatarImageSet:{
        type:Boolean,
        default:false
    },
    avatarImage:{
        type:String,
        default:""
    }
})

const Users = mongoose.model("Users",userSchema)

module.exports = Users