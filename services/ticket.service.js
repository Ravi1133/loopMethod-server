const eventModel = require("../db/models/event.model")
const ticketModel = require("../db/models/ticket.model")
const { response_service_sucess, response_service_error } = require("../util/response")
const qrCode = require("qrcode")
const path = require("path")
const { qrCodeGeneration } = require("../util")
const { TICKET_STATUS } = require("../util/constants")
const generatePDF = require("../util/ticketGenerator")
const userModel = require("../db/models/user.model")
const createTicket_service = async (body) => {
    try {
        // eventId, userId,qr,eventcategory,status
        let payload = {
            eventId: body.eventId,
            userId: body.userData.userId,
            category: body.eventcategory
        }
        console.log("createTicket_service payload", payload)
        let ticketObj = await ticketModel.create(payload)
        console.log("createTicket_service ticketObj", ticketObj)
        return response_service_sucess({ data: ticketObj, message: "Ticket Created Successfully" })
    } catch (err) {
        console.log("createTicket_service error", err)
        return response_service_error({ data: null, message: "something went Wrong" })
    }
}

const updateTicket_service = async (body, id) => {
    try {
        let payload = {
            category: body.eventcategory,
            status: body.status
        }
        const updatedTicket = await Ticket.findOneAndUpdate(
            {
                ticketId: ticketId, // Match the ticket
                status: "AVAILABLE" // Only proceed if the status is AVAILABLE
            },
            {
                $set: {
                    status: "BOOKED", // Update the status to BOOKED
                    userId: userId    // Assign the user to the ticket
                }
            },
            {
                new: true // Return the updated document
            }
        );

        //   if (!updatedTicket) {
        //     return res.status(400).json({
        //       message: "Ticket is already BOOKED or EXPIRED"
        //     });
        //   }

        //   return res.status(200).json({
        //     message: "Ticket successfully BOOKED",
        //     ticket: updatedTicket
        //   });
        console.log("updateTicket_service payload", payload, id)
        let updatedData = await ticketModel.findByIdAndUpdate(id, payload, { new: true })
        console.log("updateTicket_service updatedData", updatedData)
        return response_service_sucess({ data: updatedData, message: "Ticket Updated Successfully" })
    } catch (err) {
        console.log("updateTicket_service err", err)
        return response_service_error({ data: null, message: err.message })

    }
}

const bookTicket_service = async (body) => {
    try {
        let { userId, category, eventId } = body

        // let categoryC={GENERAL:10,VVIP:2,VIP:5}
        console.log("category",category)
        let eventData = await eventModel.findById(eventId)
        let userData =await userModel.findById(userId)
        let storeDataToCreateQr = {}
        console.log("eventData", eventData)
        let response = {}
        if(!eventData){
            return response_service_error({ data: response, message: "Event not Available" })
        }
        if (category.GENERAL) {
            if (eventData.ticketCount.GENERAL != 0 && eventData.ticketCount.GENERAL.size >= category.GENERAL) {
                storeDataToCreateQr.GENERAL = await ticketModel.insertMany(Array.from({ length: category.GENERAL }).map( (item) => {
                    return { status: "BOOKED", userId, eventId, category: "GENERAL" }
                }))
                // return await ticketModel.insertMany({ status: "BOOKED", userId, eventId, category: "GENERAL" })
                console.log("eventId", eventId)
                console.log(eventData.ticketCount.GENERAL - category.GENERAL, "calculation")
                await eventModel.findByIdAndUpdate(eventId, { $set: { "ticketCount.GENERAL.size": eventData.ticketCount.GENERAL.size - category.GENERAL } })
            } else {
                response.GENERAL = "GENERAL Tickets not Awailable"
            }
        }
        if (category.VIP) {
            if (eventData.ticketCount.VIP != 0 && eventData.ticketCount.VIP.size >= category.VIP) {
                storeDataToCreateQr.VIP = await ticketModel.insertMany(Array.from({ length: category.VIP }).map((item) => {
                    return { status: "BOOKED", userId, eventId, category: "VIP" }
                }))
                await eventModel.findByIdAndUpdate(eventId, { $set: { "ticketCount.VIP.size": eventData.ticketCount.VIP.size - category.VIP } })

            } else {
                response.VIP = "VIP Tickets not Awailable"
            }
        }
        if (category.VVIP) {
            if (eventData.ticketCount.VVIP != 0 && eventData.ticketCount.VVIP.size >= category.VVIP) {
                storeDataToCreateQr.VVIP =await ticketModel.insertMany(Array.from({ length: category.VVIP }).map((item) => {
                    return { status: "BOOKED", userId, eventId, category: "VVIP" }
                }))
                await eventModel.findByIdAndUpdate(eventId, { $set: { "ticketCount.VVIP.size": eventData.ticketCount.VVIP.size - category.VVIP } })

            } else {
                response.VVIP = "VVIP Tickets not Awailable"
            }
        }
        console.log(response, "response")
        console.log(JSON.stringify(storeDataToCreateQr), "storeDataToCreateQr")
        function qrCodeGenerationWithPromise(id, url) {
            return Promise.resolve(qrCodeGeneration(id, url)); // Wrap it if it's already a promise
        }
        if (Object.keys(response).length > 0) {
            return response_service_error({ data: response, message: "Error While Bookin" })
        } else {
            const qrCodesInfo=[]
            console.log("aya andr")
            for (const x in storeDataToCreateQr) {
                const items = storeDataToCreateQr[x] || [];
                for (const item of items) {
                    try {
                        const qrPath = await qrCodeGenerationWithPromise(
                            `${item._id}_${item.eventId}`,
                            `http://10.13.0.165:4000/api/v1/ticket/scanTicket?ticketId=${item._id?.toString()}`
                        );
                        console.log(qrPath, "qrPath");
            
                        qrCodesInfo.push({
                            imagePath: path.resolve(__dirname, "../asset/", `qrcode_${item._id}_${item.eventId}.png`),
                            info: `${item.category}-${item._id}`,
                        });
                    } catch (error) {
                        console.error("Error generating QR code:", error);
                    }
                }
            }
            let outPath="/ticketPdf"
            generatePDF(qrCodesInfo,outPath,userData.email)   
            // setTimeout(() => {
                
            // }, 3000);
             
            return response_service_sucess({ data: [], message: "Ticket Booked Successfully Check Your Mail " })
        }

        //    await ticketModel.insertMany({status:"ACTIVE"},{userId:userId})
    } catch (err) {
        console.log("updateTicket_service err", err)
        return response_service_error({ data: null, message: err.message })
    }
}


const scanTicket_service=async(body)=>{
    try{
        let {ticketId,email}=body
       let ticketData_beforeScanned=await ticketModel.findById(ticketId)
       if(!ticketData_beforeScanned){
        return response_service_error({ data: null, message: "No Ticket Found" })
       }
       if(!["BOOKED","ACTIVE"].includes(ticketData_beforeScanned.status)){
        return response_service_error({ data: ticketData_beforeScanned, message: "TIcket Is no longer avaialble" })
       }

       let ticketData_AfterScanned=await ticketModel.findByIdAndUpdate(ticketId,{status:"SCANNED"},{new :true})
       return response_service_sucess({ data: ticketData_AfterScanned, message: "Ticket Scanned Successfully" })


    }catch(err){
        console.log("scanTicket_service",err)
        return response_service_error({ data: null, message: err.message })
    }
}
// bookTicket_service({ userId: "6787abc84c639aa1f2070481", eventId: "6787aca8a2c6ac175960f694", category: { GENERAL: 100,VIP:30,VVIP:10 } })
module.exports = {
    createTicket_service,
    updateTicket_service,
    bookTicket_service,
    scanTicket_service
}

