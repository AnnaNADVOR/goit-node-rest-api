const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken"); 
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { nanoid }   = require("nanoid");

const {
    HttpError,
    controllerWrapper,
    sendEmail,
} = require("../helpers");
const { User } = require("../models/userModel"); 

require('dotenv').config();
const { SECRET_KEY,
BASE_URL,} = process.env; 

const userRegistration = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    if (user) {
        throw HttpError(409, "Email in use");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const avatarURL = gravatar.url(email, { d: "identicon" });
    const verificationToken = nanoid();

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL,
        verificationToken,
    });
    
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href = "${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a> `
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,            
        }
    })
}

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params; 
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(
        user._id,
        {
            verify: true,
            verificationToken: null,
        }
    )
    res.status(200).json({
        message: "Verification successful",
    })
}

const resendingVerifyEmail = async (req, res) => {
    const { email } = req.body; 
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(404, "User not found");
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a 
            target="_blank"
            href = "${BASE_URL}/api/users/verify/${user.verificationToken}">
                Click verify email.
            </a> `
    };

    await sendEmail(verifyEmail);
ь
    res.status(200).json({
        message: "Verification email sent",
    })
}

const userLogin = async (req, res) => {
    const { email, password } = req.body; 
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
        throw HttpError(401, "Email not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) { 
        throw HttpError(401, "Email or password is wrong");
    }
    const payload = { id: user._id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1w" });
    await User.findOneAndUpdate(user._id, {token})
    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
}

const getCurrentUser = async (req, res, next) => {
    const { email, subscription } = req.user; 
    res.status(200).json ({
        email,
        subscription,
    })
}

const userLogout = async (req, res, next) => {
    const {_id } = req.user; 
    await User.findOneAndUpdate(_id, { token: "" }); 
    res.status(204).json({});
}

const updateSubscription = async (req, res, next) => {
    const { _id } = req.user; 
    const data = req.body; 
    const result = await User.findByIdAndUpdate(_id, data, { new: true });
    if (!result) {
        throw HttpError(404, "Not found");     
    }
    res.json(result);
}

const updateAvatar = async (req, res, next) => {
    const { _id } = req.user; 
    const avatarsDir = path.join(__dirname, "../", "public", "avatars");
    if (!req.file) {
        throw HttpError(400, "File is required!");     
    }
    const { path: oldPath, originalname } = req.file; 
    const fileName = `${_id}_${originalname}`; 
    const newPath = path.join(avatarsDir, fileName); 
    try {
        const avatar = await Jimp.read(oldPath);
        avatar
            .resize(250, 250)
            .write(oldPath);
    } catch (error) {
        throw HttpError (404)
    }

    await fs.rename(oldPath, newPath);
    const avatarURL = "/avatars/" + fileName; 
    await User.findByIdAndUpdate(_id, { avatarURL }); 
    res.status(200).json({
        avatarURL,
    })
}

module.exports = {
    userRegistration: controllerWrapper(userRegistration),
    verifyEmail: controllerWrapper(verifyEmail),
    resendingVerifyEmail: controllerWrapper(resendingVerifyEmail),
    userLogin: controllerWrapper(userLogin),
    userLogout: controllerWrapper(userLogout),
    getCurrentUser: controllerWrapper(getCurrentUser),
    updateSubscription: controllerWrapper(updateSubscription),
    updateAvatar: controllerWrapper(updateAvatar),   
}