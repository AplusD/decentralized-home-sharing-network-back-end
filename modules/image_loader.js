var multer = require('multer');
 

const upload = multer({
    dest:'images/', 

    limits: {fileSize: 10000000, files: 1},
    
    fileFilter:  (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) 
            return callback(new Error('Only Images file types are allowed !'), false)
        callback(null, true);
    }
}).single('image'); 

module.exports = upload; 