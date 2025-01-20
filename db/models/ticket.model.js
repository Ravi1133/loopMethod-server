const mongoose=require("mongoose")
const ticketSchema=require("../schema/ticket.schema")
module.exports= mongoose.model("ticket",ticketSchema)