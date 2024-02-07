const express = require("express");
const { validateBody, authenticate } = require("../middlewares");
const { schemas } = require("../models/userModel");
const {
    userRegictration,
    userLogin,
    getCurrent,
    userLogout,
    updateSubscription,
} = require("../controllers/usersControllers");
const usersRouter = express.Router();

usersRouter.post("/register", validateBody(schemas.registerSchema), userRegictration);
usersRouter.post("/login", validateBody(schemas.loginSchema), userLogin);
usersRouter.post("/logout", authenticate, userLogout);
usersRouter.get("/current", authenticate, getCurrent); 
usersRouter.patch("/", authenticate, validateBody(schemas.updateSubscriptionSchema), updateSubscription);

module.exports = usersRouter; 