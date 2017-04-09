'use strict';
var express = require('express');
var NotificationController = require('../controllers/notification');
var notificationRouter = express.Router();
var authService = require('../services/authentication');


notificationRouter.route('/register').post(authService.ensureAuthenticated,NotificationController.register);
//postRouter.route('/getPosts').get(authService.ensureAuthenticated,NotificationController.getPosts);

module.exports = notificationRouter;

