const mongoose = require("mongoose")
const {Schema} = mongoose

const messageSchema = new Schema({
    message:{
        text:{
            type:String,
            required:true
        }
    },
    users:Array,
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    }
},{timestamps:true})

const Messages = mongoose.model("Messages",messageSchema)

module.exports = Messages