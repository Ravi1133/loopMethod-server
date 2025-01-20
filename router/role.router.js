
const { updateRole_controller, createRole_controller, getAllRoles_contorller } = require("../controller/role.controller")
const { validateUser } = require("../util")
const { roleUpdateValidate, roleCreateValidate } = require("../util/validator")


const roleRoute=require("express").Router()


roleRoute.post("/createRole",roleCreateValidate,createRole_controller)
roleRoute.post("/updateRole",validateUser, roleUpdateValidate,updateRole_controller)
roleRoute.post("/getRoles", getAllRoles_contorller)

module.exports=roleRoute