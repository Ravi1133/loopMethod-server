const {addRole_service, getAllRoles_service }= require("../services/role.service")

const createRole_controller=async(req,res)=>{
    try{
        let {name}=req.body
        let result =await addRole_service(req.body)
        if (result.status) {
            res.send(result)
        }
        else {
            res.status(400).send(result)
        }
    }catch(err){
        console.log("createRole_controller err",err)
        res.status(500).send({status:false,message:"Internal server Error"})
    }
}

const updateRole_controller=()=>{
    try{
            
    }catch(err){

    }
}
const getAllRoles_contorller=async(req,res,next)=>{
    try{
      let result= await getAllRoles_service()
      if(result.status){
        res.send(result)
      }else{
            res.status(400).send(result)
      }
    }catch(err){
        console.log("getAllRoles_contorller err",err)
        res.status(500).send({status:false,message:"Internal server Error"})

    }
}

module.exports={
    createRole_controller,
    updateRole_controller,
    getAllRoles_contorller
}

