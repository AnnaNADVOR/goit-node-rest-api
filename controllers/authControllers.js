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
    const { email, password, subscriptions } = req.body; 
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

    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
}

module.exports = {
    userRegictration: controllerWrapper(userRegictration),
    userLogin: controllerWrapper(userLogin),
}