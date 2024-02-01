const { isValidObjectId } = require("mongoose");
const HttpError  = require("./HttpError");

const isValidId = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        console.log(false)
        next(HttpError(400, `${id} is not valid id`) );
    }
    next();
};

module.exports = isValidId;