const Joi = require("joi");
const { TICKET_CATEGORY, TICKET_STATUS, USER_TYPE, ROLE_NAME, USER_STATUS_OBJ } = require("./constants");
const { default: mongoose } = require("mongoose");

const joicustomerrors = (req, res, err) => {
    try {

        let error = err.details.reduce((prev, curr) => {
            return curr.message.replace(/"/g, "");
        }, {});
        let message = error;
        let status = 400;


        return res.status(status).json({
            success: false,
            status,
            message,
            error,
        });
    }
    catch (err) {
        console.log(err, "in joi error")
    }
}

const login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    roleId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { value });
        }
        return value; // Keep the value if it's valid
    }).required()
})

const roleUpdate = Joi.object({
    roleId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { value });
        }
        return value;
    }).required(),
    event: Joi.object({
        create: Joi.bool().required(),
        update: Joi.bool().required(),
        delete: Joi.bool().required(),
        view: Joi.bool().required()
    }).optional(),
    ticket: Joi.object({
        create: Joi.bool().required(),
        update: Joi.bool().required(),
        delete: Joi.bool().required(),
        view: Joi.bool().required()
    }).optional(),
    user: Joi.object({
        create: Joi.bool().required(),
        update: Joi.bool().required(),
        delete: Joi.bool().required(),
        view: Joi.bool().required()
    }).optional()
})
const roleCreate = Joi.object({

    roleName: Joi.string().valid(...ROLE_NAME).required(),
    event: Joi.object({
        create: Joi.bool().required(),
        update: Joi.bool().required(),
        delete: Joi.bool().required(),
        view: Joi.bool().required()
    }).required(),
    ticket: Joi.object({
        create: Joi.bool().required(),
        update: Joi.bool().required(),
        delete: Joi.bool().required(),
        view: Joi.bool().required()
    }).required(),
    user: Joi.object({
        create: Joi.bool().required(),
        update: Joi.bool().required(),
        delete: Joi.bool().required(),
        view: Joi.bool().required()
    }).required()
})
const userCreate = Joi.object({
    name: Joi.string().required(),
    // age: Joi.string().required(),
    email: Joi.string().email().required(),
    type: Joi.string().valid(...USER_TYPE).optional(),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must have at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.',
            'any.required': 'Password is required.'
        }),
    roleId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { value });
        }
        return value; // Keep the value if it's valid
    }).required()
})


const eventCreate = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    date: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    image: Joi.string().required(),
    ticket: Joi.object(
        {
            GENERAL: Joi.object({
                size: Joi.number().required().min(0),
                price: Joi.number().required().min(0)
            }).required(),
            VIP: Joi.object({
                size: Joi.number().required().min(0),
                price: Joi.number().required().min(0)
            }).required(),
            VVIP: Joi.object({
                size: Joi.number().required().min(0),
                price: Joi.number().required().min(0)
            }).required(),

        }

    ).required()
})
const updateEventCreate = Joi.object({
    name: Joi.string().optional(),
    location: Joi.string().optional(),
    date: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
    ticket: Joi.object(
        {
            GENERAL: Joi.object({
                size: Joi.number().required().min(0),
                price: Joi.number().required().min(0)
            }).required(),
            VIP: Joi.object({
                size: Joi.number().required().min(0),
                price: Joi.number().required().min(0)
            }).required(),
            VVIP: Joi.object({
                size: Joi.number().required().min(0),
                price: Joi.number().required().min(0)
            }).required(),

        }
    ).optional()
})

// eventId, userId,qr,eventcategory,status

const createTicket = Joi.object({
    eventId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { value });
        }
        return value; // Keep the value if it's valid
    }).required(),
    userId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { value });
        }
        return value; // Keep the value if it's valid
    }).required(),
    eventcategory: Joi.string().valid(...TICKET_CATEGORY).required(),
    status: Joi.string().valid(...TICKET_STATUS).optional()
})



const updateTicket = Joi.object({
    // eventId: Joi.string().custom((value, helpers) => {
    //     if (!mongoose.Types.ObjectId.isValid(value)) {
    //         return helpers.error('any.invalid', { value });
    //     }
    //     return value; // Keep the value if it's valid
    // }).required(),
    // userId:Joi.string().custom((value, helpers) => {
    //     if (!mongoose.Types.ObjectId.isValid(value)) {
    //         return helpers.error('any.invalid', { value });
    //     }
    //     return value; // Keep the value if it's valid
    // }).required(),
    eventcategory: Joi.string().valid(...TICKET_CATEGORY).required(),
    status: Joi.string().valid(...TICKET_STATUS).optional()
})
const bookTicket = Joi.object({

    eventId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { value });
        }
        return value; // Keep the value if it's valid
    }).required(),
    category: Joi.object(
        {
            GENERAL: Joi.number().min(0).required(),
            VIP: Joi.number().min(0).required(),
            VVIP: Joi.number().min(0).required()

        }).required()
})

const blockeUnblock=Joi.object({
    status:Joi.string().allow(...Object.keys(USER_STATUS_OBJ)).required(),
    idToBlock:Joi.string().required()
})
// ...TICKET_CATEGORY.map((item)=>{
//     return {
//         [item]:Joi.number().min(0).required()
//     }
// })
const options = {
    // generic option
    basic: {
        abortEarly: true,
        convert: true,
        allowUnknown: false,
        stripUnknown: true
    },
    // Options for Array of array
    array: {
        abortEarly: true,
        convert: true,
        allowUnknown: true,
        stripUnknown: {
            objects: true
        }
    }
};
const blockeUnblockUser = (req, res, next) => {
    try {
        let {
            error,
            value
        } = blockeUnblock.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }
    } catch (error) {
        console.log("error userValidate", error);
    }
}

const roleCreateValidate = (req, res, next) => {
    try {
        let {
            error,
            value
        } = roleCreate.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }
    } catch (error) {
        console.log("error userValidate", error);
    }
}
const roleUpdateValidate = (req, res, next) => {
    try {
        let {
            error,
            value
        } = roleUpdate.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }
    } catch (error) {
        console.log("error userValidate", error);
    }
}
const userValidate = (req, res, next) => {
    try {
        let {
            error,
            value
        } = userCreate.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }
    } catch (error) {
        console.log("error userValidate", error);
    }

}
const loginValidate_Payload = (req, res, next) => {
    try {
        let {
            error,
            value
        } = login.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }

    } catch (error) {
        console.log("error userValidate", error);
    }

}
const updateUserValidate = (req, res, next) => {
    try {
        let {
            error,
            value
        } = updateEventCreate.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }

    } catch (error) {
        console.log("error userValidate", error);
    }

}


const eventValidate = (req, res, next) => {

    try {
        let {
            error,
            value
        } = eventCreate.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }

    } catch (error) {
        console.log("error userValidate", error);
    }
}

const createTicketEvent = (req, res, next) => {
    try {
        let {
            error,
            value
        } = createTicket.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }
    } catch (error) {
        console.log("error createTicketEvent", error);
    }
}

const updateTicketEvent = (req, res, next) => {
    try {
        let {
            error,
            value
        } = updateTicket.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }
    } catch (error) {
        console.log("error createTicketEvent", error);
    }
}

const bookTicketEvent = (req, res, next) => {
    try {
        let {
            error,
            value
        } = bookTicket.validate(req.body, options);

        if (error) {
            return joicustomerrors(req, res, error)
            // return response.joierrors(req, res, error)
        } else {
            next()
        }
    } catch (error) {
        console.log("error createTicketEvent", error);
    }
}


module.exports = {
    userValidate,
    updateUserValidate,
    eventValidate,
    createTicketEvent,
    updateTicketEvent,
    bookTicketEvent,
    loginValidate_Payload,
    roleUpdateValidate,
    roleCreateValidate,
    blockeUnblockUser
}