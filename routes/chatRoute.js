'use strict';
var express = require('express');

var cloudinary = require('cloudinary').v2;
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var ChatController = require('../controllers/chat');
var ChatRoomController = require('../controllers/chatRoom');
var chatRouter = express.Router();

cloudinary.config({
    cloud_name: 'shoppingdirectory',
    api_key: '967339527283183',
    api_secret: '74NXckYl9m1-O0_ZTU8U_qoIDfw'
});



//userRouter.route('/updateUser/:user_id').post(commons.ensureAuthenticated, userController.updateUser);

module.exports = chatRouter;

