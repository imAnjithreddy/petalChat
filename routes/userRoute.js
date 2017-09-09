'use strict';
var express = require('express');

var cloudinary = require('cloudinary').v2;
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var UserController = require('../controllers/user');
var authService = require('../services/authentication');
var userRouter = express.Router();

cloudinary.config({
    cloud_name: 'shoppingdirectory',
    api_key: '967339527283183',
    api_secret: '74NXckYl9m1-O0_ZTU8U_qoIDfw'
});



//userRouter.route('/updateUser/:user_id').post(commons.ensureAuthenticated, userController.updateUser);
userRouter.route('/create').post(UserController.createUser);
userRouter.route('/update').post(authService.ensureAuthenticated,UserController.updateUser);
userRouter.route('/get/:id').get(authService.ensureAuthenticated,UserController.getUser);
userRouter.route('/getUsers').get(authService.ensureAuthenticated,UserController.getUsers);
userRouter.route('/follow/:userId').post(authService.ensureAuthenticated,UserController.submitFollowing);
userRouter.route('/unfollow/:userId').post(authService.ensureAuthenticated,UserController.deleteFollowing);
module.exports = userRouter;

