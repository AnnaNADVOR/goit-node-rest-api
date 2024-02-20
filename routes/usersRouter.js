const express = require("express");
const {
    validateBody,
    authenticate,
    upload,
} = require("../middlewares");
const { schemas } = require("../models/userModel");
const {
    userRegistration,
    verifyEmail,
    resendingVerifyEmail,
    userLogin,
    getCurrentUser,
    userLogout,
    updateSubscription,
    updateAvatar,
} = require("../controllers/usersControllers");

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(schemas.registerSchema), userRegistration);
usersRouter.get("/verify/:verificationToken", verifyEmail);
usersRouter.post("/verify", validateBody(schemas.emailSchema), resendingVerifyEmail);
usersRouter.post("/login", validateBody(schemas.loginSchema), userLogin);
usersRouter.post("/logout", authenticate, userLogout);
usersRouter.get("/current", authenticate, getCurrentUser); 
usersRouter.patch("/", authenticate, validateBody(schemas.updateSubscriptionSchema), updateSubscription);
usersRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);


module.exports = usersRouter; 