const express = require("express");
const { validateBody } = require("../helpers");
const { schemas } = require("../models/userModel");
const { userRegictration } = require("../controllers/authControllers");
const authRouter = express.Router();

authRouter.post("/register", validateBody(schemas.registerSchema), userRegictration)

module.exports = authRouter; 