const {
    HttpError,
    controllerWrapper,
} = require("../helpers");
const { Contact } = require("../models/contactModel");

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user; 
    const { page = 1, limit = 20, favorite } = req.query; 
    const filter = { owner };
    if (favorite) {
        filter.favorite = favorite; 
    };
    const skip = (page - 1) * limit;
    const result = await Contact.find(
        filter,
        "-createdAt -updatedAt",
        { skip, limit }
    ).populate("owner", "email");
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
    const { _id: owner } = req.user; 
    const result = await Contact.create({ ...req.body, owner });  
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