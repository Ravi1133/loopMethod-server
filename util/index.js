const path = require("path")
const qrCode = require("qrcode")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const { getRoleById_service } = require("../services/role.service")

const qrCodeGeneration = async(id, text) => {
    console.log("qrCodeGeneration id", id)
    try {

        const qrFileName = `qrcode_${id}.png`;
        const downloadFolder = path.join(__dirname, "..", 'asset');
        // console.log(downloadFolder, "downloadFolder")
        const qrPath = path.join(downloadFolder, qrFileName);
        console.log(qrPath, "qrPath")
        await qrCode.toFile(qrPath, text)
        return qrPath
    } catch (err) {
        console.log("error in qr generation", err)
    }

}

const getherImageAndMakePDF=()=>{
    try{
    
    }catch(err){

    }
}


const varifyToken = (token) => {
    try {

        console.log("token to varify", token)
        let secreate = process.env.JWT_SECRET
        let checkData = jwt.verify(token, secreate)
        // console.log(checkData, "checkData")
        // console.log("diff time", checkData.exp - checkData.iat)
        return { status: true, ...checkData }
    } catch (err) {
        console.log("varifyToken err", err.message)
        return { status: false, message: err.message }
    }
}

const generateToken = (data) => {

    let secreate = process.env.JWT_SECRET
    let token = jwt.sign(data, secreate, { expiresIn: 60 * 60 })
    let varify = jwt.verify(token, secreate)
    console.log("varified immidiatly", varify)
    // setTimeout(() => {
    //    let tokenData= varifyToken(token)
    //    console.log(tokenData,"tokenData")
    //    console.log(tokenData.iat-tokenData.exp)
    // }, 10000);
    return token
}

// generateToken({message:"dadsda"})

const roleAccess = {
    event: {
        create: ["/createEvent", "/getAllEvent", "/profitLoss","/getEventById"],
        update: ["/updateEvent","/getEventById"],
        delete: [''],
        view: ['/getAllEvent',"/getEventById"]
    },
    ticket: {
        create: ["/createTicket","/bookTickets"],
        update: ["/updateTicket","/bookTickets","/scanTicket"],
        delete: [''],
        view: ['/', '/']
    }, user: {
        create: ["/createTicket"],
        update: ["/getAllUser"],
        delete: ['/blockUser'],
        view: ["/getuserById"]
    }
}

const checkAccessPool = (data, url) => {
    try {
        if (!data) {
            return false;
        }

        const keys = Object.keys(roleAccess); // Get all keys in roleAccess (e.g., "event", "ticket", "user")
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]; // Current key (e.g., "event")

            // Check if the roleAccess key exists in `data` and has permissions set
            if (data[key]) {
                const permissions = Object.keys(roleAccess[key]); // Get permissions (e.g., "create", "update", "delete", "view")

                for (let j = 0; j < permissions.length; j++) {
                    const permission = permissions[j]; // Current permission (e.g., "create")

                    // Check if the permission is true in the data
                    if (data[key][permission]) {
                        // Check if the URL exists in the roleAccess pool for that key and permission
                        if (roleAccess[key][permission].includes(url)) {
                            return true; // URL is allowed
                        }
                    }
                }
            }
        }

        return false; // If no match is found, deny access
    } catch (err) {
        console.error(err, "Error in checking access");
        return false;
    }
};
// console.log(checkAccessPool({
//     ticket: { create: true, update: true, delete: true, view: true },
//     event: { create: true, update: true, delete: false, view: true },
//     user: { create: true, update: true, delete: true, view: true },
//     _id: '6788f30e652ab98059b52ae7',
//     roleName: 'USER',
//     createdAt: "2025-01-16T11:52:46.240Z",
//     updatedAt: "2025-01-16T11:52:46.240Z",
//     __v: 0
// }, "/updateEvent"), "dekha")

const validateUser = async (req, res, next) => {
    try {
        console.log(req.url, "req")
        let pathName=req.path.split('/').pop()
        console.log("coming pathName",`/${pathName}`)
        let token = req.headers["authorization"]

        if (!token) {
            res.status(401).send({ status: false, message: "Token Is Missing" })
            return
        }
        token = token.replace("Bearer ", "")
        // console.log("token validateUser", token)
        let tokenValidationResponse = varifyToken(token)
        // console.log(tokenValidationResponse, "tokenValidationResponse")
        let roleData = await getRoleById_service(tokenValidationResponse.roleId)
        console.log(roleData, "roleData")
        if (roleData.status) {
            let isAllow = checkAccessPool(roleData.data, `/${pathName}`)
            if (!isAllow) {
                res.status(401).send({ status: false, message: "UnAuthorised" })
                return
            }
        }
        req.user = tokenValidationResponse
        if (!tokenValidationResponse.status) {
            res.status(401).send({ status: false, message: tokenValidationResponse.message })

        } else {
            next()
        }

    } catch (err) {
        console.log("validateUser err", err)
        res.status(500).send({ status: false, message: "Something Went Wrong" })

    }
}

function getPagingData(list, page, limit, totalcount) {
    const total = totalcount;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(total / limit);
    const pageMeta = {};
    pageMeta.size = limit;
    pageMeta.page = currentPage;
    pageMeta.total = total;
    pageMeta.totalPages = totalPages;
    pageMeta.pageCount = totalPages;
    return {
        pageMeta,
        list
    };
}
let storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './asset/event_Images')
    },
    filename: function (req, file, cb) {
        console.log(file.originalname, "file.originalname")
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})
let upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 } })


module.exports = {
    qrCodeGeneration,
    generateToken,
    varifyToken,
    generateToken,
    validateUser,
    getPagingData,
    upload
}
