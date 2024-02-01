const { mongoose } = require("mongoose");
const { Schema } = require("mongoose");
const Joi= require("joi");
const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email:  {
        type: String,
    },
    phone:  {
        type: String,
        // match: /^\d{2}-\d{2}-\d{4}$/,
    },
    favorite:  {
        type: Boolean,
        default: false, 
    },
}, { versionKey: false, timestamps: true });

contactSchema.post("save", handleMongooseError);

const Contact = mongoose.model("contact", contactSchema);

const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean()
});

const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    favorite: Joi.boolean()
}).min(1).message("Body must have at least one field");

const schemas = {
    createContactSchema,
    updateContactSchema, 
}

module.exports = {
    Contact,
    schemas,
}; 