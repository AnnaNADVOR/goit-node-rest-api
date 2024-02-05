const express = require("express");
const { validateBody } = require("../middlewares");
const { schemas } = require("../models/userModel");
const {
    userRegictration,
    userLogin
} = require("../controllers/authControllers");
const authRouter = express.Router();

authRouter.post("/register", validateBody(schemas.registerSchema), userRegictration);
authRouter.post("/login", validateBody(schemas.loginSchema), userLogin);

module.exports = authRouter; 