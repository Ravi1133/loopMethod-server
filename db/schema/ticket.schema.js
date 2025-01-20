const {Schema}=require("mongoose")
const { TICKET_CATEGORY, TICKET_STATUS } = require("../../util/constants")
// const TICKET_STATUS=["BOOKED","SCANNED","EXPIRED"]
// const TICKET_CATEGORY=["GENERAL","VIP","VVIP"]
const ticketSchema =new Schema({
    eventId:{
        type:Schema.Types.ObjectId,
        require:true
    }, userId:{
        type:Schema.Types.ObjectId,
        require:true
    },
    qrcode:{
       type:String,
       require:true
    },
    category:{
        type:String,
        require:true,
        enum:TICKET_CATEGORY,
        default:TICKET_CATEGORY[0]
    },
    price:{
        type:String,
        require:true,
    },
    status:{
        type:String,
        require:true,
        enum:TICKET_STATUS,
        default:TICKET_STATUS[0]
    },
    
},{
    timestamps:true
})

module.exports=ticketSchema