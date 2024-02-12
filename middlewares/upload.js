const multer = require("multer");
const path = require("path");
const { HttpError } = require ("../helpers")
const tempDir = path.join(__dirname, "../", "temp"); 
// console.log("upload")
const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },  
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);       
    } else {
        cb(HttpError(400, 'Only images is allowed'), false);   
    }
    
}

const upload = multer({
    storage: storage,   
    fileFilter,
})

module.exports = upload; 