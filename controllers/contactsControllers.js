const {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContactById,
} = require("../services/contactsServices");
const { HttpError } = require("../helpers");
const { createContactSchema } = require("../schemas/contactsSchemas");

const getAllContacts = async (req, res, next) => {
    try {
        const allContacts = await listContacts();
        res.json(allContacts);  
    } catch (error) {
        next(error);      
    }    
};

const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundContact = await getContactById(id);
        if (!foundContact) {
            throw HttpError(404);     
        }
        res.json(foundContact);
    } catch (error) {
        next(error);    
    }  
};

const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const result = await removeContact(id); 
        if (!result) {
            throw  HttpError(404);   
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const createContact = async (req, res, next) => {
    try {
        const {error} = createContactSchema.validate(req.body)
        if (error) {
            throw HttpError(400);
        }
        const { name, email, phone } = req.body;
        const newContact = await addContact(name, email, phone);  
        res.status(201).json(newContact);
    } catch (error) {
        next(error);  
    }
};

const updateContact = async (req, res, next) => {
    try {
        const {error} = createContactSchema.validate(req.body)
        if (error) {
            throw HttpError(400);
        }       
        const { id } = req.params; 
        const data = req.body; 
        const result = await updateContactById(id, data);
        if (!result) {
            throw HttpError(404);     
        }
        res.json(result);
    } catch (error) {
        next(error); 
    }
};

module.exports = {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
}