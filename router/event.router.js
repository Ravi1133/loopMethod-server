const { createEvent_controller, updateEvent_controller, getAllEvent_controller, profitLossEvent_controller, eventImageUpload_controller, getEventById_controller } = require("../controller/event.controller")
const { updateTicket_controller } = require("../controller/ticket.controller")
const { createEvent } = require("../services/event.service")
const { validateUser, upload } = require("../util")
const { eventValidate, updateUserValidate, createTicketEvent } = require("../util/validator")

const eventRoute=require("express").Router()

// createEvent updateEvent profitLoss upload
eventRoute.post("/createEvent",validateUser,eventValidate,createEvent_controller)
eventRoute.get("/getEventById",validateUser,getEventById_controller)
eventRoute.post("/updateEvent",validateUser,updateUserValidate,updateEvent_controller)
eventRoute.post("/getAllEvent",validateUser,getAllEvent_controller)
eventRoute.get("/profitLoss",validateUser,profitLossEvent_controller)

eventRoute.post("/upload",upload.single("file"), eventImageUpload_controller)

module.exports=eventRoute