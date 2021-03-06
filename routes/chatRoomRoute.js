'use strict';
var express = require('express');


var ChatRoomController = require('../controllers/chatRoom');
var chatRoomRouter = express.Router();
var authService = require('../services/authentication');


//userRouter.route('/updateUser/:user_id').post(commons.ensureAuthenticated, userController.updateUser);
chatRoomRouter.route('/get/:user').get(authService.ensureAuthenticated,ChatRoomController.getChatRoom);
chatRoomRouter.route('/all').get(authService.ensureAuthenticated,ChatRoomController.getChatRooms);
chatRoomRouter.route('/update/:id').post(authService.ensureAuthenticated,ChatRoomController.updateChatRoom);
chatRoomRouter.route('/delete/:id').post(authService.ensureAuthenticated,ChatRoomController.deleteChatRoom);

module.exports = chatRoomRouter;

