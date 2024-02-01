const express = require ("express");
const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} = require("../controllers/contactsControllers");
const {
  validateBody,
  isValidId,
} = require("../helpers");
const {schemas} = require("../models/contactModel");

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

// contactsRouter.delete("/:id",  isValidId, deleteContact);

contactsRouter.post("/", validateBody(schemas.createContactSchema), createContact);

// contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), updateContact);

module.exports =  contactsRouter;