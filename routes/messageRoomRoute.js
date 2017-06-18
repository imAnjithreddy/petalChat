'use strict';
var express = require('express');


var MessageRoomController = require('../controllers/messageRoom');
var messageRoomRouter = express.Router();
var authService = require('../services/authentication');


messageRoomRouter.route('/getRoom').get(authService.ensureAuthenticated,MessageRoomController.getMessageRoom);
messageRoomRouter.route('/leaveRoom').post(authService.ensureAuthenticated,MessageRoomController.leaveMessageRoom);
messageRoomRouter.route('/getRooms').get(authService.ensureAuthenticated,MessageRoomController.getMessageRooms);

module.exports = messageRoomRouter;

