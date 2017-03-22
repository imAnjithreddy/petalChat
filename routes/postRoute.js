'use strict';
var express = require('express');

var cloudinary = require('cloudinary').v2;
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var PostController = require('../controllers/post');
var postRouter = express.Router();
var authService = require('../services/authentication');
cloudinary.config({
    cloud_name: 'shoppingdirectory',
    api_key: '967339527283183',
    api_secret: '74NXckYl9m1-O0_ZTU8U_qoIDfw'
});



//postRouter.route('/updatePost/:post_id').post(commons.ensureAuthenticated, postController.updatePost);
postRouter.route('/create').post(authService.ensureAuthenticated,PostController.createPost);
postRouter.route('/getPosts').get(authService.ensureAuthenticated,PostController.getPosts);
postRouter.route('/get/:id').get(authService.ensureAuthenticated,PostController.getPost);
module.exports = postRouter;

