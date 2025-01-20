const { updateEvent_controller, createEvent_controller } = require("../controller/event.controller")
const { createTiket_controller, updateTicket_controller, bookTicket_controller, scanTicket_controller } = require("../controller/ticket.controller")
const { createEvent } = require("../services/event.service")
const { validateUser } = require("../util")
const { createTicketEvent, updateTicketEvent, bookTicketEvent } = require("../util/validator")

const eventRoute=require("express").Router()


eventRoute.post("/createTicket",validateUser,createTicketEvent,createTiket_controller)
eventRoute.post("/updateTicket/:id",validateUser,updateTicketEvent,updateTicket_controller)
eventRoute.post("/bookTickets",validateUser,bookTicketEvent,bookTicket_controller)
eventRoute.get("/scanTicket",scanTicket_controller)

module.exports=eventRoute