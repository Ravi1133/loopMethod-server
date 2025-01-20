const { Schema } = require("mongoose")
const { TICKET_CATEGORY } = require("../../util/constants")

const eventSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    ticketCount: {
         GENERAL: {
            size:{
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
            price:{
                type: Number,
                required: true,
            }
         } ,
         VIP:{
            size:{
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
            price:{
                type: Number,
                required: true,
            }
         }   ,    
         VVIP:{
            size:{
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
            price:{
                type: Number,
                required: true,
            }
         }   
    },
    description: {
        type: String,
        require: true
    },
    eventDateTime: {
        type: Date, // Stores both date and time
        required: true
    },
    image:{
        type: String,
        require: true  
    },
    location: {
        type: String,
        require: true
    },
    createdById:{
        type: String,
        require: true
    }

}, {
    strict:true,
    timestamps: true
})

module.exports = eventSchema