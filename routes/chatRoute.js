'use strict';
var express = require('express');

var ChatController = require('../controllers/chat');

var chatRouter = express.Router();
var authService = require('../services/authentication');


//userRouter.route('/updateUser/:user_id').post(commons.ensureAuthenticated, userController.updateUser);
chatRouter.route('/create/:roomID').post(authService.ensureAuthenticated,ChatController.createChat);
chatRouter.route('/getChats/:roomID').get(authService.ensureAuthenticated,ChatController.getChats);


module.exports = chatRouter;

