'use strict';
var express = require('express');
var PostController = require('../controllers/post');
var postRouter = express.Router();
var authService = require('../services/authentication');

//postRouter.route('/updatePost/:post_id').post(commons.ensureAuthenticated, postController.updatePost);
postRouter.route('/create').post(authService.ensureAuthenticated,PostController.createPost);
postRouter.route('/like/:postId').post(authService.ensureAuthenticated,PostController.submitLike);
postRouter.route('/unlike/:postId').post(authService.ensureAuthenticated,PostController.deleteLike);
postRouter.route('/views/:postId').post(authService.ensureAuthenticated,PostController.saveViewsPost);
postRouter.route('/delete/:postId').delete(authService.ensureAuthenticated,PostController.deletePost);
//postRouter.route('/getPosts').get(authService.ensureAuthenticated,PostController.getPosts);
postRouter.route('/getPosts').get(authService.ensureAuthenticated,PostController.getPosts);
postRouter.route('/get/:id').get(authService.ensureAuthenticated,PostController.getPost);
module.exports = postRouter;

