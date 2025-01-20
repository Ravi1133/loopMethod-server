const mongoose=require("mongoose")
const roleSchema=require("../schema/role.schema")
module.exports= mongoose.model("role",roleSchema)