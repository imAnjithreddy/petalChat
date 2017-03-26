'use strict';
'use strict';
var express = require('express');

var cloudinary = require('cloudinary').v2;
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var uploadController = require('../controllers/upload');

var authService = require('../services/authentication');
cloudinary.config({
    cloud_name: 'shoppingdirectory',
    api_key: '967339527283183',
    api_secret: '74NXckYl9m1-O0_ZTU8U_qoIDfw'
});


var multer = require('multer');
var upload = multer({ dest: './uploads/'});
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var uploadRouter = express.Router();


uploadRouter.route('/multipleUpload').post(authService.ensureAuthenticated,upload.array('file',5),uploadController.multipleUpload);

uploadRouter.route('/singleUpload').post(authService.ensureAuthenticated,upload.single('file'),uploadController.singleUpload);




module.exports = uploadRouter;
