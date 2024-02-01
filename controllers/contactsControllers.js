const {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContactById,
} = require("../services/contactsServices");
const {
    HttpError,
    controllerWrapper,
} = require("../helpers");
// const {
//     createContactSchema,
//     updateContactSchema
// } = require("../schemas/contactsSchemas");
const Book = require("../models/contactModel")

const getAllContacts = async (_, res) => {
    const result = await Book.find();
    res.json(result);      
};

// const getOneContact = async (req, res) => {
//     const { id } = req.params;
//     const result = await getContactById(id);
//     if (!result) {
//         throw HttpError(404, "Not found");     
//     }
//     res.json(result);    
// };

// const deleteContact = async (req, res) => {
//     const { id } = req.params; 
//     const result = await removeContact(id); 
//     if (!result) {
//         throw  HttpError(404, "Not found");   
//     }
//     res.json(result); 
// };

const createContact = async (req, res) => {
    // const {error} = createContactSchema.validate(req.body)
    // if (error) {
    //     throw HttpError(400, error.message);
    // }
    // const { name, email, phone } = req.body;
    const result = await Book.create(req.body);  
     res.status(201).json(result);   
};

// const updateContact = async (req, res) => {
//     // const { error } = updateContactSchema.validate(req.body);
//     // if (error) {
//     //     throw HttpError(400, error.message);
//     // }       
//     const { id } = req.params; 
//     const data = req.body; 
//     const result = await updateContactById(id, data);
//     if (!result) {
//         throw HttpError(404, "Not found");     
//     }
//     res.json(result);  
// };

module.exports = {
    getAllContacts: controllerWrapper(getAllContacts),
    // getOneContact: controllerWrapper(getOneContact),
    // deleteContact: controllerWrapper(deleteContact),
    createContact: controllerWrapper(createContact),
    // updateContact: controllerWrapper(updateContact),
}