const roleModel = require("../db/models/role.model")
const userModel = require("../db/models/user.model")
const { generateToken, getPagingData } = require("../util")
const { USER_STATUS_OBJ, USER_TYPE_OBJ } = require("../util/constants")
const { sendEmailForVerification } = require("../util/mail")
const { response_service_sucess, response_service_error } = require("../util/response")
const jwt = require("jsonwebtoken")
const createUser_service = async (body) => {
    try {
        console.log("Body", body)
        
        let roleData= await roleModel.findById(body.roleId)
        body={...body,roleName:roleData.roleName}
        let userFind = await userModel.findOne({ email: body.email })
    
        if (userFind) {
            return response_service_error({ data: userFind, message: "user Is already Present With This Email number" })
        }
        let data = new userModel(body)
        let dataSaved = await data.save()
        let path=process.env.BASE_URL+"/api/v1/user/verifyUser"+`?userId=${dataSaved._id}`
        sendEmailForVerification(path,body.email)
        console.log(dataSaved, "dataSaved")
        return response_service_sucess({ data, message: "Please check your mail" })
    } catch (err) {
        console.log(" error in createUser", err.message)
        return response_service_error({ data: null, message: err.message })
    }
}


const getAllUser_service = async (body) => {
    try {
      let { limit = 10, page } = body;
  
      let skip = (page - 1) * limit;
  
      let countDoc = await userModel.countDocuments();
        console.log(skip,"skip",limit)
      let result = await userModel.find({roleName:{$ne:USER_TYPE_OBJ.ADMIN}}).skip(skip).limit(limit).lean();
  
    //   console.log("getAllUser_service result:", result);

      let pagiData = getPagingData(result, page, limit, countDoc);
  
      return response_service_sucess({
        data: pagiData,
        message: "Successfully fetched data",
      });
  
    } catch (err) {
      console.error("Error in getAllUser_service:", err);
      return response_service_error({
        message: "Failed to fetch data",
        error: err.message,
      });
    }
  };


const loginUser_service = async (body) => {
    try {
        let { email, password ,roleId} = body
        console.log("loginUser_service body",body)
        let userData = await userModel.findOne({ email ,roleId}).lean()
        
        console.log("loginUser_service userData",userData)
        if(!userData){
            return response_service_error({ data: null, message: "No User Found" })
        }
        if(userData.status==USER_STATUS_OBJ.BLOCKED){
            return response_service_error({ data: null, message: "Please Contact To Your Administration" })
        }
        if(userData.status==USER_STATUS_OBJ.INACTIVE){
            return response_service_error({ data: null, message: "Please Verify Your Email" })
        }
        let token = generateToken({ roleName:userData.roleName,roleId:userData.roleId,userId:userData._id })
        console.log("tokentoken",token)
        let response = await userModel.findOneAndUpdate({ email }, { token: token },{new:true}).lean()
        let roleData=await roleModel.findById(response.roleId).lean()
        console.log("response",response)
        console.log("loginUser_service roleData",roleData)
        if(roleData)response.roleData=roleData
        if (response) {
            return response_service_sucess({ data: response, message: "Logged In Successfully" })
        } else {
            return response_service_error({ data: null, message: "Something went wrong" })
        }
    } catch (err) {
        console.log("loginUser_service error", err)
        return response_service_error({ data: null, message: "Something went wrong" })

    }
}
const  getuserById_service =async (id)=>{
    try{
       let userData= await  userModel.findById(id)
        if(userData){
            return response_service_sucess({ data: userData, message: "User fetched Successfully" })
        }else{
            return response_service_error({ data: null, message: "User Does'nt Exist" })
        }
    }catch(err){
        console.log( "getuserById_service err",err)
        return response_service_error({ data: null, message: "Something went wrong" })

    }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGFkQGdtYWlsLmNvbSIsImlhdCI6MTczNzAwODU3MywiZXhwIjoxNzM3MDA4NTc4fQ.vtgvUY7gWAH3l3XtaPUpCqHr4JEF5sqfydzJeaZkFOE
const  blockUser_service =async (id,data,body)=>{
    try{
        console.log(data,"data",id)
        
       let userData= await userModel.findByIdAndUpdate(body.idToBlock,{status:body.status})
        if(userData){
            return response_service_sucess({ data: userData, message: `User ${body.status} Successfully` })
        }else{
            return response_service_error({ data: null, message: "User Does'nt Exist" })
        }
    }catch(err){
        console.log( "getuserById_service err",err)
        return response_service_error({ data: null, message: "Something went wrong" })

    }
}

const verifyUser_service =async (id)=>{
    try{
        // console.log(data,"data",id)
       
        
       let userData= await userModel.findByIdAndUpdate(id,{status:USER_STATUS_OBJ.ACTIVE},{new:true})
        if(userData){
            return response_service_sucess({ data: userData, message: `User ${userData.status} Successfully` })
        }else{
            return response_service_error({ data: null, message: "User Does'nt Exist" })
        }
    }catch(err){
        console.log( "getuserById_service err",err)
        return response_service_error({ data: null, message: "Something went wrong" })

    }
}


 
module.exports = {
    createUser_service,
    getAllUser_service,
    loginUser_service,
    getuserById_service,
    blockUser_service,
    verifyUser_service
}