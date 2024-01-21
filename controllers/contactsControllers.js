const {
    listContacts,
    getContactById,
    addContact,
    removeContact,
} = require("../services/contactsServices")

const {HttpError} = require("../helpers")
const getAllContacts = async (req, res) => {
    try {
      const allContacts = await listContacts();
    res.json(allContacts);  
    } catch (error) {
        res.status(500).json({
            message: "Server error!"
        })       
    }    
};

const getOneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const foundContact = await getContactById(id);
        if (!foundContact) {
            throw HttpError(404);     
        }
        res.json(foundContact);
    } catch (error) {
        const { status = 500, message = "Server error!" } = error;
        res.status(status).json({
            message,
        })       
    }  

};

const deleteContact = (req, res) => {};

const createContact = (req, res) => { };

const updateContact = (req, res) => { };

module.exports = {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
}