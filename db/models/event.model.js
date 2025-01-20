const mongoose =require("mongoose")
const eventSchema=require("../schema/event.schema")
module.exports=mongoose.model("event",eventSchema)