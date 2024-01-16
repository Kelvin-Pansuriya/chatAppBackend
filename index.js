const express = require("express")
const db = require("./db/db")
const app = express()
const cors = require("cors")
db()
require("dotenv").config()

const socket = require("socket.io")

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.use("/api/auth", require("./routes/userRoutes"))
app.use("/api/message",require("./routes/messageRoutes"))

app.get("/",(req,res)=>{
    res.send("Chat App Backend Side....")
})

const server = app.listen(port,(err)=>{
    console.log(err)
    console.log(`Server Running On ${port} PORT`);
})

const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true
    }
})

global.onlineUsers = new Map()

io.on("connection",(socket)=>{
    global.chatSocket = socket
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message)
        }
    })
})