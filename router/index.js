const allRoutes =(app)=>{
app.use("/api/v1/user",require("./user.router"))
app.use("/api/v1/event",require("./event.router"))
app.use("/api/v1/ticket",require("./ticket.router"))
app.use("/api/v1/role",require("./role.router"))

}

module.exports=allRoutes