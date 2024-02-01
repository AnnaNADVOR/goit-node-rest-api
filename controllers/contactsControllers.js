const {
    HttpError,
    controllerWrapper,
} = require("../helpers");
const { Contact } = require("../models/contactModel")

const getAllContacts = async (_, res) => {
    const result = await Contact.find();
    res.json(result);      
};

const getOneContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
        throw HttpError(404, "Not found");     
    }
    res.json(result);    
};

const deleteContact = async (req, res) => {
    const { id } = req.params; 
    const result = await Contact.findByIdAndDelete(id); 
    if (!result) {
        throw  HttpError(404, "Not found");   
    }
    res.json(result); 
};

const createContact = async (req, res) => {
    const result = await Contact.create(req.body);  
    res.status(201).json(result);   
};

const updateContact = async (req, res) => { 
    const { id } = req.params; 
    const data = req.body; 
    const result = await Contact.findByIdAndUpdate(id, data, {new: true});
    if (!result) {
        throw HttpError(404, "Not found");     
    }
    res.json(result);  
};

const updateStatusContact = async (req, res) => {
    const { id } = req.params; 
    const data = req.body; 
    const result = await Contact.findByIdAndUpdate(id, data, {new: true});
    if (!result) {
        throw HttpError(404, "Not found");     
    }
    res.json(result);
}

module.exports = {
    getAllContacts: controllerWrapper(getAllContacts),
    getOneContact: controllerWrapper(getOneContact),
    deleteContact: controllerWrapper(deleteContact),
    createContact: controllerWrapper(createContact),
    updateContact: controllerWrapper(updateContact),
    updateStatusContact: controllerWrapper(updateStatusContact),
}