var multer = require('multer');
var path = require('path');
module.exports.inputxml={

    storage:function(){

        var storage = multer.diskStorage({

        destination: function (req, file, cb) {
            // const m = new Date();
            // const folder = `${m.getFullYear()}${m.getMonth()}${m.getDate()}`
            var folder = 'invoice-xml/input/'
            cb(null,path.join(folder))

        },

        filename: function (req, file, cb) {
            cb(null, `${file.originalname}`)

        }

        })

        return storage;

},

allowed:function(req, file, cb) {

    // Accept images only
    const fileTypes = /xml/;
  //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extName) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload File XML!!");
    }
    // if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {

    //     req.fileValidationError = 'Only image files are allowed!';

    //     return cb(new Error('Only image files are allowed!'), false);

    // }

    cb(null, true);

}}

module.exports.outputxml={

    storage:function(){

        var storage = multer.diskStorage({

        destination: function (req, file, cb) {
            // const m = new Date();
            // const folder = `${m.getFullYear()}${m.getMonth()}${m.getDate()}`
            var folder = 'invoice-xml/output/'
            cb(null,path.join(folder))

        },

        filename: function (req, file, cb) {
            cb(null, `${file.originalname}`)

        }

        })

        return storage;

},

allowed:function(req, file, cb) {

    // Accept images only
    const fileTypes = /xml/;
  //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extName) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload File XML!!");
    }
    // if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {

    //     req.fileValidationError = 'Only image files are allowed!';

    //     return cb(new Error('Only image files are allowed!'), false);

    // }

    cb(null, true);

}}