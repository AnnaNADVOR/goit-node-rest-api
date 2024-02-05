const express = require ("express");
const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = require("../controllers/contactsControllers");
const {
  validateBody,
  isValidId,
  authenticate,
} = require("../middlewares");
const {schemas} = require("../models/contactModel");

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id",  isValidId, deleteContact);

contactsRouter.post("/", validateBody(schemas.createContactSchema), createContact);

contactsRouter.put("/:id", isValidId, validateBody(schemas.updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", isValidId, validateBody(schemas.updateStatusContactSchema), updateStatusContact)

module.exports =  contactsRouter;