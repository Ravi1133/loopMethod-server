const express =require("express")
const DBconnection = require("./db/connect")
const dotenv=require("dotenv")
const allRoutes = require("./router")
const cors =require("cors")
const sendEmailWithPDF = require("./util/mail")
const generatePDF = require("./util/ticketGenerator")
const path=require("path")
const app =express("")
const fs=require("fs")
app.use(cors())
app.use(express.json())
dotenv.config()
console.log(process.env.URI,"process.env.URI")
let PORT =process.env.PORT || 4000
DBconnection(process.env.URI)
allRoutes(app)

app.post("/ds",(req,res)=>{
    
})
app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})


const qrCodesInfo = [
    { imagePath: path.resolve(__dirname, './asset/qrcode_678ddfa54182d1b03bc22527_678c7f286beda161f4ba8cbe.png'), info: 'Information for QR 1' }
    // { imagePath: path.resolve(__dirname, './asset/qrcode_678c7fb06beda161f4ba8cd0_678c7f286beda161f4ba8cbe.png'), info: 'Information for QR 2' },
    // { imagePath: path.resolve(__dirname, './asset/qrcode_678c7fb06beda161f4ba8cd3_678c7f286beda161f4ba8cbe.png'), info: 'Information for QR 2' },
];


const absoluteImagePath = path.resolve(__dirname, '../', "/Users/a1/Desktop/projecInt/server/asset/qrcode_678ddc03dc834c31c8b5fd05_678ceae0f0c51778cb16ce8d.png")

console.log("absoluteImagePath",absoluteImagePath)
// Function to generate a PDF
let outPath="/ticketPdf"
// generatePDF(qrCodesInfo,outPath,"ravidwivedi135581133@gmail.com")
console.log(fs.existsSync("/Users/a1/Desktop/projecInt/server/asset/qrcode_678de264c7fac4c00a01e06d_678c7f286beda161f4ba8cbe.png"),"check if True")
