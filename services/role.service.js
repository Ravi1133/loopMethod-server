const roleModel = require("../db/models/role.model")
const { response_service_error, response_service_sucess } = require("../util/response")

const addRole_service = async (body) => {
    try {
        let { name ,...rest} = body
        console.log("addRole_service body",body)
        let addRoleObj = {
            roleName: body.roleName,
            ticket: {
                create: body.ticket.create,
                update: body.ticket.update,
                delete: body.ticket.delete,
                view: body.ticket.view
            },
            event: {
                create: body.event.create,
                update: body.event.update,
                delete: body.event.delete,
                view: body.event.view
            },
            user: {
                create: body.user.create,
                update: body.user.update,
                delete: body.user.delete,
                view: body.user.view
            }
        }

        let roleData =await roleModel.findOne({roleName:body.roleName})
        console.log("roleModel",)
        if(roleData){
            return response_service_error({ data: null, message: "Role is Already present" })
        }
        let roleMongoObjToSave = new roleModel(addRoleObj)
        let savedRoleData = await roleMongoObjToSave.save()
        if (savedRoleData) {
            return response_service_sucess({ data: savedRoleData, message: "Role Created Successfully" })
        } else {
            return response_service_error({ data: null, message: "Something went Wrong" })
        }

    } catch (err) {
        console.log("addRole_service err", err)
        return response_service_error({ data: null, message: "Something went Wrong" })
    }
}


const updateRole_service=()=>{
    try{
        
    }catch(err){

    }
}


const getAllRoles_service=async()=>{
    try{
      let allRole= await roleModel.find({})
      if(allRole.length>0){
          return response_service_sucess({ data: allRole, message: "Role Fetched Successfully" })
      }else{
        return response_service_error({ data: null, message: "No Role Found" })
      }

    }catch(err){
        console.log("getAllRoles_service err ",err)
        return response_service_error({ data: null, message: "Something went Wrong" })
    }
}
const getRoleById_service =async (id)=>{
    try{
       let roleData= await roleModel.findById(id)
        if(roleData){
            return response_service_sucess({ data: roleData, message: "Role Fetch Successfully" })
        }
        else{
            return response_service_error({ data: null, message: "No Role Found" })
        }
    }catch(err){

        return response_service_error({ data: null, message: "Inernal server Error" })

    }
  }

module.exports={
    addRole_service,
    updateRole_service,
    getAllRoles_service,
    getRoleById_service
}