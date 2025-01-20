const {Schema} =require("mongoose")
const { ROLE_NAME } = require("../../util/constants")

const roleSchema =new Schema({
    roleName:{
        type:String,
        require:true,
        enum:ROLE_NAME
    },
    ticket:{
        create:{
            type:Boolean,
            require:true
        },
        update:{
            type:Boolean,
            require:true
        },
        delete:{
            type:Boolean,
            require:true
        },
        view:{
            type:Boolean,
            require:true
        }
    },
    event:{
        create:{
            type:Boolean,
            require:true
        },
        update:{
            type:Boolean,
            require:true
        },
        delete:{
            type:Boolean,
            require:true
        },
        view:{
            type:Boolean,
            require:true
        }
    },
    user:{
        create:{
            type:Boolean,
            require:true
        },
        update:{
            type:Boolean,
            require:true
        },
        delete:{
            type:Boolean,
            require:true
        },
        view:{
            type:Boolean,
            require:true
        }
    }

},{
    timestamps:true,
    
})
roleSchema.pre("find", function () {
    this.lean();
  });
  
  roleSchema.pre("findOne", function () {
    this.lean();
  });

module.exports=roleSchema