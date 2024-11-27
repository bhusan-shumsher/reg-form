const multer = require('multer'); // for file upload 



const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'src/files/submitted-form');
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname);
    }
});

const upload = multer({ storage:fileStorage });

const cpUpload = uploadd.fields([
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 8 },
    { name: 'file3', maxCount: 8 }
]);

module.exports = {cpUpload};
