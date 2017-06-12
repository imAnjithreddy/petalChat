'use strict';
var express = require('express');

var MessageController = require('../controllers/message');

var messageRouter = express.Router();
var authService = require('../services/authentication');


//userRouter.route('/updateUser/:user_id').post(commons.ensureAuthenticated, userController.updateUser);
messageRouter.route('/create/:roomID').post(authService.ensureAuthenticated,MessageController.createMessage);
messageRouter.route('/getMessages/:roomID').get(authService.ensureAuthenticated,MessageController.getMessages);


module.exports = messageRouter;

