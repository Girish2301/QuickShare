const multer = require('multer');
const path = require('path');

let fileStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null,"uploads/"),
    filename: (req, file, cb) => {
        const uniqueFileName = `${Date.now()} - ${Math.round(
            Math.random() * 1e9
        )} ${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
    },
});

let upload = multer({
    storage: fileStorage,
    limits: { fileSize: 10 ** 7}
}).single('uploadedFile');

module.exports = upload;