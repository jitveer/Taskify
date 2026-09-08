const multer = require('multer');
const path = require('path');


// 1. Storage Configuration: decide file directory location and name of file 
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


// 2. File Filter , We can decide file type here
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp|pdf|doc|docx|xls|xlsx|csv|ppt|pptx|txt/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only images, PDFs, Word docs, Excel sheets, and Presentation files are allowed!"), false);
    }
};



// 3. Multer Initialization
const upload = multer(
    {
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 10 * 1024 * 1024  // FILE SIZE LIMIT : 10MB
        }
    }
);

module.exports = upload;