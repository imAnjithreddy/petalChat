'use strict';
var express = require('express');

var cloudinary = require('cloudinary').v2;
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var UserController = require('../controllers/user');
var userRouter = express.Router();

cloudinary.config({
    cloud_name: 'shoppingdirectory',
    api_key: '967339527283183',
    api_secret: '74NXckYl9m1-O0_ZTU8U_qoIDfw'
});


console.log("entedted the codeeeeeee");
//userRouter.route('/updateUser/:user_id').post(commons.ensureAuthenticated, userController.updateUser);
userRouter.route('/create').post(UserController.createUser);
userRouter.route('/getUsers').get(UserController.getUsers);
module.exports = userRouter;

