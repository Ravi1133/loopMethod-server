const response_service_sucess=({message,data})=>{
    try{
        return {
            status:true,
            message,
            data
        }
    }catch(err){

    }
}

const response_service_error=({message,data})=>{
    try{
        return{
            status:false,
            message,
            data
        }
    }catch(err){

    }
}



const response_controller_success=(message,data)=>{
    try{

    }catch(err){

    }
}


const response_controller_error =()=>{
    try{

    }catch(err){

    }
}

module.exports={
    response_service_sucess,
    response_service_error,
    response_controller_error,
    response_controller_success
}
