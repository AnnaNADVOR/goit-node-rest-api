const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken"); 
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const {
    HttpError,
    controllerWrapper,
} = require("../helpers");
const { User } = require("../models/userModel"); 

require('dotenv').config();
const { SECRET_KEY } = process.env; 

const userRegictration = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 
    if (user) {
        throw HttpError(409, "Email in use");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,            
        }
    })
}

const userLogin = async (req, res) => {
    const { email, password } = req.body; 
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
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

const getCurrent = async (req, res, next) => {
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
    
    const { path: oldPath, originalname } = req.file; 
    const fileName = `${_id}_${originalname}`; 
    const newPath = path.join(avatarsDir, fileName); 
    try {
        const avatar = await Jimp.read(oldPath);
        avatar
            .resize(250, 250)
            .write(newPath);
    } catch (error) {
        throw HttpError (404)
    }

    // await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", fileName); 
    await User.findByIdAndUpdate(_id, { avatarURL }); 
    res.status(200).json({
        avatarURL,
    })
}

module.exports = {
    userRegictration: controllerWrapper(userRegictration),
    userLogin: controllerWrapper(userLogin),
    userLogout: controllerWrapper(userLogout),
    getCurrent: controllerWrapper(getCurrent),
    updateSubscription: controllerWrapper(updateSubscription),
    updateAvatar: controllerWrapper(updateAvatar),
}