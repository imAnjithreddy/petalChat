'use strict';
var express = require('express');


var UpvoteController = require('../controllers/upvote');
var upvoteRouter = express.Router();
var authService = require('../services/authentication');




upvoteRouter.route('/create').post(authService.ensureAuthenticated,UpvoteController.createUpvote);
upvoteRouter.route('/delete/:postId').post(authService.ensureAuthenticated,UpvoteController.deleteUpvote);
upvoteRouter.route('/get/:postId').get(authService.ensureAuthenticated,UpvoteController.getUpvote);

module.exports = upvoteRouter;

