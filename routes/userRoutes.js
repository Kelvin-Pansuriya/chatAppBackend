const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Users = require("../model/userModel")
const router = express.Router()
require("dotenv").config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "This Is JWT Auth For EasyChat ChatApp"


// Creating A New User Using POST Method And URL Is = "http://localhost:5000/api/auth/register"
router.post("/register", async(req,res)=>{
    try{
        const {username,email,password} = req.body
        const checkUsername = await Users.findOne({username:username})
        if(checkUsername){
            return res.json({err:"username Is Taken Try To New username",status:false})
        }
        const checkEmail = await Users.findOne({email:email})
        if(checkEmail){
            return res.json({err:"email Is Already Exist",status:false})
        }

        const salt = await bcrypt.genSalt(10)
        const securePassword = await bcrypt.hash(password,salt)

        const user = new Users({
            username:username,
            email:email,
            password:securePassword
        })

        const createUser = await user.save()

        const userPassToken = {
            user:{
                _id:createUser._id,
                username:createUser.username,
                email:createUser.email
            }
        }
        const registerToken = jwt.sign(userPassToken,JWT_SECRET_KEY)
        res.status(200).json({registerToken,status:true,user:createUser})
    }
    catch(err){
        console.log(err);
        res.status(500).json({err:"Internal Server Error",status:false})
    }
})

// Login Routes For User Using POST Method And URL Is "http://localhost:5000/api/auth/login"
router.post("/login", async(req,res)=>{
    try{

        const {email,password} = req.body
        const user = await Users.findOne({email:email})

        if(!user){
            return res.json({err:"Invalid Inputes",status:false})
        }

        const checkPassword = await bcrypt.compare(password,user.password)
        if(!checkPassword){
            return res.json({err:"Invalid Inputes",status:false})
        }

        const userPassToken = {
            user:{
                _id:user._id,
                username:user.username,
                email:user.email
            }
        }

        const loginToken = jwt.sign(userPassToken,JWT_SECRET_KEY)
        res.status(200).json({loginToken,status:true,user})
    }
    catch(err){
        console.log(err);
        res.json({err:"Internal Server Error",status:false})
    }
})

// Set Avatar Routes For Set Avatar In User Using POST Method And URL Is "http://localhost:5000/api/auth/setAvatar/:id"
router.post("/setAvatar/:id", async (req,res)=>{
    try{
        const id = req.params.id
        const {avatarImage} = req.body
        const user = await Users.findById(id)

        if(!user){
            return res.json({err:"User Not Found",status:false})
        }

        const updatedUser = await Users.findByIdAndUpdate(id,{$set:{avatarImage:avatarImage,isAvatarImageSet:true}}, {new:true})
        res.json({user:updatedUser,status:true})
    }
    catch(err){
        console.log(err);
        res.json({err:"Internal Server Error",status:false})
    }

})

// Now Get The All Users For Creating Contacts Using GET Method And Route Is http://localhost:5000/api/auth/allUsers/:id
router.get("/allUsers/:id", async(req,res)=>{
    try{
        const id = req.params.id
        const users = await Users.find({_id:{ $ne:id }}).select(["_id","username","email","avatarImage"])
        res.json({users:users,status:true})
    }
    catch(err){
        console.log(err);
        res.json({err:"Internal Server Error",status:false})
    }
})

module.exports = router