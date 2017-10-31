'use strict';
var express = require('express');


var CommentController = require('../controllers/comment');
var commentRouter = express.Router();
var authService = require('../services/authentication');


commentRouter.route('/create/:postId').post(authService.ensureAuthenticated,CommentController.createComment);
commentRouter.route('/delete/:postId').post(authService.ensureAuthenticated,CommentController.deleteComment);
commentRouter.route('/get/:postId').get(authService.ensureAuthenticated,CommentController.getComments);

module.exports = commentRouter;

