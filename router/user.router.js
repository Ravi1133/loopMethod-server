const userRouter =require("express").Router()
const multer = require("multer")
const fs =require("fs")
const {createUser_controller, getAllUser_controller, loginUser_controller, getuserById_controller, blockUser_controller}=require("../controller/user.controller")
const { varifyToken, validateUser } = require("../util")
const { userValidate, loginValidate_Payload, blockeUnblockUser } = require("../util/validator")

userRouter.post("/createUser",userValidate,createUser_controller)
userRouter.get("/getuserById/:id",getuserById_controller)
userRouter.post("/getAllUser",validateUser, getAllUser_controller)
userRouter.post("/login",loginValidate_Payload,loginUser_controller)
userRouter.post("/blockUser",validateUser,blockeUnblockUser, blockUser_controller)


module.exports=userRouter