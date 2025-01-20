const mongoose =require("mongoose")


const DBconnection=(uri)=>{

    mongoose.connect(uri).then((data)=>{
        console.log("database connected")
    }).catch((err)=>{
        console.log("Error in Database Connection",err)
    })
}

module.exports=DBconnection