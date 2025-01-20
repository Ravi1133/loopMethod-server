const eventModel = require("../db/models/event.model")
const ticketModel = require("../db/models/ticket.model")
const { response_service_sucess, response_service_error } = require("../util/response")
const qrCode = require("qrcode")
const path = require("path")
const { qrCodeGeneration } = require("../util")
const { TICKET_STATUS } = require("../util/constants")
const generatePDF = require("../util/ticketGenerator")
const userModel = require("../db/models/user.model")
const { default: mongoose } = require("mongoose")
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
    const session = await mongoose.startSession();
    try {
        let { userId, category, eventId } = body;
        console.log("category", category);

        
        session.startTransaction();

        let eventData = await eventModel.findById(eventId).session(session);
        let userData = await userModel.findById(userId).session(session);
        let storeDataToCreateQr = {};
        let response = {};

        if (!eventData) {
            await session.abortTransaction();
            return response_service_error({ data: response, message: "Event not Available" });
        }

        // Function to handle ticket booking logic
        const bookTickets = async (categoryKey) => {
            if (category[categoryKey]) {
                const ticketCount = eventData.ticketCount[categoryKey]?.size || 0;
                if (ticketCount >= category[categoryKey]) {
                    const tickets = Array.from({ length: category[categoryKey] }).map(() => ({
                        status: "BOOKED",
                        userId,
                        eventId,
                        category: categoryKey,
                    }));
                    storeDataToCreateQr[categoryKey] = await ticketModel.insertMany(tickets, { session });
                    await eventModel.findByIdAndUpdate(
                        eventId,
                        { $inc: { [`ticketCount.${categoryKey}.size`]: -category[categoryKey] } },
                        { session }
                    );
                } else {
                    response[categoryKey] = `${categoryKey} Tickets not Available`;
                }
            }
        };

        // Book tickets for all categories
        await bookTickets("GENERAL");
        await bookTickets("VIP");
        await bookTickets("VVIP");

        if (Object.keys(response).length > 0) {
            await session.abortTransaction();
            return response_service_error({ data: response, message: "Error While Booking" });
        }

        
        await session.commitTransaction();

        // QR Code generation
        const qrCodeGenerationWithPromise = (id, url) =>
            Promise.resolve(qrCodeGeneration(id, url));

        const qrCodesInfo = [];
        for (const category in storeDataToCreateQr) {
            const items = storeDataToCreateQr[category] || [];
            for (const item of items) {
                try {
                    const qrPath = await qrCodeGenerationWithPromise(
                        `${item._id}_${item.eventId}`,
                        `${process.env.BASE_URL}/api/v1/ticket/scanTicket?ticketId=${item._id?.toString()}`
                    );
                    qrCodesInfo.push({
                        imagePath: path.resolve(__dirname, "../asset/", `qrcode_${item._id}_${item.eventId}.png`),
                        info: `${item.category}-${item._id}`,
                    });
                } catch (error) {
                    console.error("Error generating QR code:", error);
                }
            }
        }

        // Generate PDF
        let outPath = "/ticketPdf";
        generatePDF(qrCodesInfo, outPath, userData.email);

        return response_service_sucess({ data: [], message: "Ticket Booked Successfully. Check Your Mail" });
    } catch (err) {
        console.log("updateTicket_service err", err);
        await session.abortTransaction();
        return response_service_error({ data: null, message: err.message });
    } finally {
        session.endSession();
    }
};


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

