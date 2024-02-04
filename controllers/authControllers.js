const {
    HttpError,
    controllerWrapper,
} = require("../helpers");
const { User } = require("../models/userModel"); 

const userRegictration = async (req, res) => {
    const newUser = await User.create(req.body);
  
    res.status(201).json({
        user: {
            email:req.body.email,
        }
    })
}

module.exports = {
    userRegictration: controllerWrapper(userRegictration),
}