const { Schema, model } = require("mongoose");
const Joi= require("joi");
const { handleMongooseError } = require("../helpers");
const subscriptions = ["starter", "pro", "business"];

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: subscriptions,
        default: "starter",
    },
    token: String
}, { versionKey: false, timestamps: true }); 

userSchema.post("save", handleMongooseError);
const User = model("User", userSchema);

const registerSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscriptions: Joi.string().valid(subscriptions), 
})

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
})

const schemas = {
    registerSchema,
    loginSchema,   
}

module.exports = {
    User, 
    schemas,
}