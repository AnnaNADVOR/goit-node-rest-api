const {
    listContacts,
    getContactById,
    addContact,
    removeContact,
} = require("../services/contactsServices")

export const getAllContacts = async (req, res) => {
    const result = await listContacts();
    
};

export const getOneContact = (req, res) => {};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};