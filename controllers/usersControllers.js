const {
    HttpError,
    controllerWrapper,
} = require("../helpers");
const { User } = require("../models/userModel"); 
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken"); 
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
    const newUser = await User.create({...req.body, password: hashPassword});
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
    res.status(204).json({
       message: "No Content"
    })
}

const updateSubscription = async (req, res, next) => {
    const { _id, subscription } = req.user; 
    const data = req.body; 
    const result = await User.findByIdAndUpdate(_id, data, { new: true });
    if (!result) {
        throw HttpError(404, "Not found");     
    }
    res.json(result);
}

module.exports = {
    userRegictration: controllerWrapper(userRegictration),
    userLogin: controllerWrapper(userLogin),
    userLogout: controllerWrapper(userLogout),
    getCurrent: controllerWrapper(getCurrent),
    updateSubscription: controllerWrapper(updateSubscription),
}