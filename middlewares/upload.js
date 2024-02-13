const multer = require("multer");
const path = require("path");
const { HttpError } = require ("../helpers")
const tempDir = path.join(__dirname, "../", "temp"); 

const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },  
})

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')){
        cb(HttpError(400, 'Only images is allowed'), false);   
    } else {
        cb(null, true);    
    }              
}

const upload = multer({
    storage: storage,   
    fileFilter,
})

module.exports = upload; 