const {
    listContacts,
    getContactById,
    addContact,
    removeContact,
} = require("../services/contactsServices")

const {HttpError} = require("../helpers")
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

const deleteContact = (req, res, next) => {
 
};

const createContact = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const newContact = await addContact(name, email, phone);  
        res.status(201).json(newContact);
    } catch (error) {
        next(error);  
    }
 };

const updateContact = (req, res) => { };

module.exports = {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
}