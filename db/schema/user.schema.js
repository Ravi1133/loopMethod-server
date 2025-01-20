const {Schema} =require("mongoose")
const { USER_TYPE, USER_STATUS, USER_STATUS_OBJ } = require("../../util/constants")

 let userSchema=new Schema({
    name:{
        type:String,
        require:true
    },
    profilePic:{
        type:String,
        require:true
    },
    // age:{
    //     type:String,
    //     require:true
    // },
    // mobile:{
    //     type:String,
    //     require:true,
    //     unique:true
    // },
    email:{
        type:String,
        require:true
    },
    type:{
        type:String,
        require:true,
        enum:USER_TYPE,
        default:USER_TYPE[0]
    },
    status:{
        type:String,
        require:true,
        enum:USER_STATUS,
        default:USER_STATUS_OBJ.INACTIVE
    },
    password:{
        type:String,
        require:true
    },
    token:{
        type:String
    },
    roleId:{
        type:String,
        require:true
    },
    roleName:{
        type:String,
        require:true
    }
 },{
    timestamps:true
 })

 module.exports=userSchema