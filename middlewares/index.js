const validateBody = require("../middlewares/validateBody");
const isValidId = require("../middlewares/isValidId");
const authenticate = require("../middlewares/authenticate");

module.exports = {
    validateBody,
    isValidId,
    authenticate,
}