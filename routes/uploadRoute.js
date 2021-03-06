'use strict';
'use strict';
var express = require('express');

var cloudinary = require('cloudinary').v2;
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var uploadController = require('../controllers/upload');

var authService = require('../services/authentication');
cloudinary.config({
    cloud_name: '123456',
    api_key: '123456',
    api_secret: '123456'
});


var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var uploadRouter = express.Router();


uploadRouter.route('/multipleUpload').post(authService.ensureAuthenticated,upload.array('file',5),uploadController.multipleUpload);

uploadRouter.route('/singleUpload').post(authService.ensureAuthenticated,upload.single('file'),uploadController.singleUpload);
uploadRouter.route('/stringUpload').post(authService.ensureAuthenticated,uploadController.uploadBASE64);
uploadRouter.route('/singleUploadId').post(authService.ensureAuthenticated,upload.single('file'),uploadController.singleUploadId);
uploadRouter.route('/deleteUpload').post(authService.ensureAuthenticated,uploadController.deleteUpload);
uploadRouter.route('/getImages').get(authService.ensureAuthenticated,uploadController.getImages);




module.exports = uploadRouter;
