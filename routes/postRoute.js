'use strict';
var express = require('express');

var cloudinary = require('cloudinary').v2;
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var PostController = require('../controllers/post');
var postRouter = express.Router();

cloudinary.config({
    cloud_name: 'shoppingdirectory',
    api_key: '967339527283183',
    api_secret: '74NXckYl9m1-O0_ZTU8U_qoIDfw'
});



//postRouter.route('/updatePost/:post_id').post(commons.ensureAuthenticated, postController.updatePost);
postRouter.route('/create').post(PostController.createPost);
postRouter.route('/getPosts').get(PostController.getPosts);
postRouter.route('/getPost').get(PostController.getPost);
module.exports = postRouter;

