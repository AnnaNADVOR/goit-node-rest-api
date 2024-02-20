const { Schema, model } = require("mongoose");
const Joi= require("joi");
const { handleMongooseError } = require("../helpers");

const subscriptions = ["starter", "pro", "business"];
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    password: {
        type: String,
        minlength: 6,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        match: emailRegexp,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: subscriptions,
        default: "starter",
    },
    token: String,
    avatarURL: String,
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String, 
        default: null,
        required: [true, 'Verify token is required'],
    }
}, { versionKey: false, timestamps: true }); 

userSchema.post("save", handleMongooseError);

const User = model("User", userSchema);

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid(...subscriptions), 
})

const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),    
})

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid(...subscriptions), 
})

const schemas = {
    registerSchema,
    loginSchema, 
    updateSubscriptionSchema,
    emailSchema,
}

module.exports = {
    User, 
    schemas,
}