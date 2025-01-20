const { createEvent_service, updateEvent_service, getAllEvent_service, profitLossEvent_service, getEvetnById_service } = require("../services/event.service")
const { USER_TYPE_OBJ } = require("../util/constants")
const { response_controller_success } = require("../util/response")


const createEvent_controller = async (req, res) => {
    try {

        console.log("createEvent_controller req.body", req.body)
        let actionTaker=req.user
        console.log("createEvent_controller req.user",req.user)
        let { name, location, date, description, image, ticket, price } = req.body
        let payload = { name, location, date, description, image, ticket, price ,createdById:actionTaker.userId}
        console.log()
        let result = await createEvent_service(payload)
        if (result.status) {
            res.send(result)
        }
        else {
            res.status(400).send(result)
        }
    } catch (err) {
        console.log("createEvent_controller err", err)
        res.statusCode(500).send({ message: "Internal server Error" })
    }
}
const getEventById_controller = async (req, res) => {
    try {

        console.log("createEvent_controller req.body", req.query)
        let actionTaker=req.user
        console.log("createEvent_controller req.user",req.user)
        
        let result = await getEvetnById_service(req.query.eventId)
        if (result.status) {
            res.send(result)
        }
        else {
            res.status(400).send(result)
        }
    } catch (err) {
        console.log("createEvent_controller err", err)
        res.statusCode(500).send({ message: "Internal server Error" })
    }
}


const updateEvent_controller = async (req, res) => {
    try {
          let eventId=req.query.eventId  
        console.log("createEvent_controller req.body", req.body)
        let actionTaker=req.user
        let { name, location, date, description, image, ticket, price } = req.body
        let payload = { name, location, date, description, image, ticket ,userId: actionTaker.userId}
        let result = await updateEvent_service(payload, eventId)
        if (result.status) {
            res.send(result)
        }
        else {
            res.status(400).send(result)
        }
    } catch (err) {

    }
}

const getAllEvent_controller = async (req, res) => {
    try {
        let { limit, page } = req.body
        console.log("req.user",req.user)
        let {roleName,roleId,userId} =req.user
        
        
        let result = await getAllEvent_service({ limit, page,roleName,roleId,userId })
        if (result.status) {
            res.send(result)

        } else {
            res.status(400).send(result)
        }

    } catch (err) {
        console.log("createEvent_controller err", err)
        res.status(500).send({ message: "Internal server Error" })
    }
}

const profitLossEvent_controller = async (req, res) => {
    try {
        console.log("req.query",req.query)
        let eventId= req.query.eventId
        let {userId}=req.user
        console.log("profitLossEvent_controller req.user",req.user)
        let payload={_id:eventId}
        if(req.user.roleName==USER_TYPE_OBJ.ORGNIZER){
            payload.createdById=userId
        }
        let result =await profitLossEvent_service(payload)
        if (result.status) {
            res.send(result)

        } else {
            res.status(400).send(result)
        }
    } catch (err) {
        console.log("profitLossEvent_controller err", err)
        res.status(500).send({ message: "Internal server Error" })
    }
}

const eventImageUpload_controller =async(req,res,next)=>{
    try{
        console.log(req.file,"req.file")
        res.send({data:req.file,message:"File Uploaded Successful"})
    }catch(err){
        console.log("eventImageUpload_controller err",err)
        res.statusCode(500).send({ message: "Internal server Error" })

    }
}
module.exports = {
    createEvent_controller,
    updateEvent_controller,
    getAllEvent_controller,
    profitLossEvent_controller,
    eventImageUpload_controller,
    getEventById_controller
}