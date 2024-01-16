const express = require("express")
const Messages = require("../model/messageModel")
const router = express.Router()

// Add Messages In MongoDB DataBase Using POST Method And URL Is http://localhost:5000/api/message/addmsg 
router.post("/addmsg",  async (req,res)=>{
    try{
        const {from,to,message} = req.body

        const data = await Messages.create({
            message:{text:message},
            users:[from,to],
            sender:from
        })

        if(!data){
            return res.json({msg:"Meesage Is Not Added To DataBase",status:false})
        }

        res.json({msg:"Message Added Successfully....",status:true})
    }
    catch(err){
        console.log(err);
        res.json({err:"Internal Server Error",status:false})
    }
})

// Get All The Messages Using POST Method And URL Is http://localhost:5000/api/message/getmsg
router.post("/getmsg", async (req,res)=>{
    try{
        const {from,to} = req.body
        const messages = await Messages.find({users:{$all:[from,to]}}).sort({updatedAt:1})

        const projectMessages = messages.map((msg)=>{
            return {
                message:msg.message.text,
                fromSelf:msg.sender.toString() === from
            }
        })
        res.json({projectMessages,status:true})
    }
    catch(err){
        console.log(err);
        res.json({err:"Internal Server Error",status:false})
    }
})

module.exports = router