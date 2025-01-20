const { createUser_service, getAllUser_service, loginUser_service, getuserById_service, blockUser_service } = require("../services/user.service")

const createUser_controller = async (req, res) => {
    try {
        console.log("data in createuser", req.body)

        let serviceData = await createUser_service(req.body)
        console.log("serviceDat", serviceData)
        if (serviceData.status) {
            res.status(200).send(serviceData)
        } else {
            res.status(400).send(serviceData)
        }
    } catch (err) {
        console.log("createUser_controller err", err)
    }
}

const getAllUser_controller = async (req, res) => {
    try {

        let { limit, page } = req.body
        let response = await getAllUser_service({ limit, page })
        if (response.status) {
            res.status(200).send(response)
        } else {
            res.status(400).send(response)

        }
    } catch (err) {
        console.log("getAllUser_controller err", err)
        res.status(500).send({ status: false, message: "Internal server Error" })

    }
}

const getuserById_controller = async (req, res) => {
    try {
        let id = req.params.id
        let response = await getuserById_service(id)
        if (response.status) {
            res.status(200).send(response)
        } else {
            res.status(400).send(response)
        }
    } catch (err) {
        console.log("getuserById_controller err", err)
        res.status(500).send({ status: false, message: "Internal server Error" })
    }
}

const loginUser_controller = async (req, res) => {
    try {
        let { email, password, roleId } = req.body
        let result = await loginUser_service({ email, password, roleId })

        if (result.status) {
            res.status(200).send(result)
        } else {
            res.status(400).send(result)
        }
    } catch (err) {
        console.log("loginUser_controlle errorr", err)
    }
}


const blockUser_controller = async (req, res) => {
    try {
        let userData = req.user
        let body=req.body
        console.log(userData, "userData")
        let result = await blockUser_service(userData.userId, userData,body)
        if (result.status) {
            res.status(200).send(result)
        } else {
            res.status(400).send(result)
        }
    } catch (err) {
        console.log("blockUser_controller errorr", err)

        res.status(500).send({ status: false, message: "Internal server Error" })
    }
}

module.exports = {
    createUser_controller,
    getAllUser_controller,
    loginUser_controller,
    getuserById_controller,
    blockUser_controller
}
