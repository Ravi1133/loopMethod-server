const eventModel = require("../db/models/event.model")
const ticketModel = require("../db/models/ticket.model")
const { getPagingData } = require("../util")
const { TICKET_CATEGORY, USER_STATUS_OBJ, USER_TYPE_OBJ } = require("../util/constants")
const { response_service_error, response_service_sucess } = require("../util/response")

const createEvent_service = async (body) => {
    try {
        let { name, location, date, description, image, ticket,createdById } = body
        let dbObj = {
            name: body.name,
            location: body.location,
            eventDateTime: body.date,
            description: body.description,
            image: body.image,
            price: body.price,
            ticketCount: body.ticket,
            createdById:createdById
        }
        console.log("createEvent_service dbObj", dbObj)
        let eventObj = new eventModel(dbObj)
        let savedData = await eventObj.save({ validateBeforeSave: true })
        console.log("createEvent_service eventObj", savedData)
        return response_service_sucess({ data: savedData, message: "Event Created Successfully" })

    } catch (err) {
        console.log("createEvent_service err", err)
        return response_service_error({ data: null, message: "something went Wrong" })
    }
}
const getEvetnById_service = async (id) => {
    try {
        
        let eventData = await eventModel.findById(id)
        if(!eventData){
            return response_service_error({ data: null, message: "No Event Found" })
        }

        console.log("createEvent_service eventObj", eventData)
        return response_service_sucess({ data: eventData, message: "Event Fetched Successfully" })

    } catch (err) {
        console.log("createEvent_service err", err)
        return response_service_error({ data: null, message: "something went Wrong" })
    }
}


const updateEvent_service = async (body, id) => {
    try {
        let dbObj = {
            name: body.name,
            location: body.location,
            eventDateTime: body.date,
            description: body.description,
            image: body.image,
            price: body.price,
            ticketCount: body.ticket
        }
        let existEventData =await eventModel.findById(id)
        if(!existEventData){
            return response_service_error({ data: null, message: "Event Not Exist" })
        }else{
            if(existEventData.createdById!=body.userId){
                return response_service_error({ data: null, message: "You are Not Allowed to update This event" })
            }
        }
        console.log("updateEvent_service dbObj id", dbObj, id)
        let eventObj = await eventModel.findByIdAndUpdate(id, dbObj, { new: true })
        console.log("updateEvent_service eventObj", eventObj)
        if (eventObj) {
            return response_service_sucess({ data: eventObj, message: "Event Update Successfully" })
        } else {
            return response_service_error({ data: null, message: "something went Wrong" })
        }
    } catch (err) {
        console.log("updateEvent_service err", err)
        return response_service_error({ data: null, message: "something went Wrong" })
    }
}

// const getAllEvent_service =()=>{
//     try{

//     }catch(err){
//         console.log("getAllEvent_service err",err)
//         return response_service_error({data:null,message:"something went Wrong"})
//     }
// }
const getAllEvent_service = async (body) => {
    try {
        let { limit = 10, page,roleName,roleId,userId  } = body;
        console.log("getAllEvent_service body",body)
        let skip = (page - 1) * limit;
        let searchPayload={
           
        }
        if(roleName==USER_TYPE_OBJ.ORGANIZER){
            searchPayload={
                createdById: userId
             }   
        }
        console.log("getAllEvent_service searchPayload",searchPayload)
        let countDoc = await eventModel.countDocuments(searchPayload);
        console.log(skip, "skip", limit)
        let result = await eventModel.find(searchPayload).skip(skip).limit(limit).lean();

        //   console.log("getAllUser_service result:", result);

        let pagiData = getPagingData(result, page, limit, countDoc);

        return response_service_sucess({
            data: pagiData,
            message: "Successfully fetched data",
        });

    } catch (err) {
        console.log("getAllEvent_service err", err)
        return response_service_error({ data: null, message: "something went Wrong" })
    }
};

const profitLossEvent_service = async (payload) => {
    try {
        console.log(payload,"payload")
        let eventData =await eventModel.findOne(payload).lean()
        if (!eventData) {
            return response_service_error({ data: null, message: "No Event Found" })
        }
        console.log("eventData",eventData)
        let allCount = await Promise.all(TICKET_CATEGORY.map(async (item) => {
          let count= await ticketModel.countDocuments({ eventId:payload._id, status: "BOOKED", category: item })
          return {[item]: count}
        }))
        console.log(allCount, "allCount")
        let checkTest={}
        
        allCount.map((item)=>checkTest[Object.keys(item)]=Object.values(item)[0])
        // allCount={...allCount.map((item)=>)}
        return response_service_sucess({ data: {...eventData,allCount}, message: "Event Update Successfully" })

    } catch (err) {
        console.log("profitLossEvent_service err", err)
        return response_service_error({ data: null, message: "something went Wrong" })
    }
}
module.exports = {
    createEvent_service,
    updateEvent_service,
    getAllEvent_service,
    profitLossEvent_service,
    getEvetnById_service
}