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

contactsRouter.get("/:id", authenticate, isValidId, getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, deleteContact);

contactsRouter.post("/", authenticate, validateBody(schemas.createContactSchema), createContact);

contactsRouter.put("/:id", authenticate, isValidId, validateBody(schemas.updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", authenticate, isValidId, validateBody(schemas.updateStatusContactSchema), updateStatusContact)

module.exports =  contactsRouter;