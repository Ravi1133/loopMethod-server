const { createTicket_service, updateTicket_service, bookTicket_service, scanTicket_service } = require("../services/ticket.service")

const createTiket_controller = async (req, res) => {
    try {
        // eventId, userId,qr,eventcategory,status
        console.log("createTiket_controller req.body", req.body)
        let userData=req.user
        let { eventId, userId, eventcategory, status } = req.body
        let payload = {
            eventId, userData, eventcategory
        }
        console.log("createTiket_controller payload", payload)
        let result = await createTicket_service(payload)

        if (result.status) {
            res.send(result)
        }
        else {
            res.status(400).send(result)
        }
    } catch (err) {
        console.log("createTiket_controller error", err)
        res.status(500).send({ status: false, message: "Internal server Error" })
    }
}

const bookTicket_controller=async(req,res)=>{
    try{
        console.log(req.user,"req.user")
        let userId=req.user?.userId
        let {eventId,category}=req.body
        let result=await bookTicket_service({userId,eventId,category})
        if (result.status) {
            res.send(result)
        }
        else {
            res.status(400).send(result)
        }
    }catch(err){
        console.log("bookTicket_controller error", err)
        res.status(500).send({ status: false, message: "Internal server Error" })
    }
}

const updateTicket_controller = async (req,res) => {
    try {
        let payload = {
            eventId: req.body,
            userId: req.body.userId,
            eventcategory: req.body.eventcategory,
            status: req.body.status
        }
        
        

        let id=req.params?.id
        let result = await updateTicket_service(payload,id)
        if (result.status) {
            res.send(result)
        }
        else {
            res.status(400).send(result)
        }
    } catch (err) {
        console.log("updateTicket_controller err",err)
        res.status(500).send({ status: false, message: "Internal server Error" })

    }
}
const scanTicket_controller=async(req,res)=>{
    try{
        let ticketId=req.query.ticketId
        let result=await scanTicket_service({ticketId})
        if (result.status) {
            const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Express HTML Response</title>
        </head>
        <body>
            <h1>Ticket scanned Successfully</h1>
        </body>
        </html>
    `;
            res.send(htmlContent)
        }
        else {
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Express HTML Response</title>
            </head>
            <body>
                <h1>Error While Scaning</h1>
            </body>
            </html>
        `;
            res.status(400).send(htmlContent)
        }
    }catch(err){
        console.log("bookTicket_controller error", err)
        res.status(500).send({ status: false, message: "Internal server Error" })
    }
}

module.exports = {
    updateTicket_controller,
    createTiket_controller,
    bookTicket_controller,
    scanTicket_controller
}