'use strict';
var express = require('express');


var BlockController = require('../controllers/block');
var blockRouter = express.Router();
var authService = require('../services/authentication');




blockRouter.route('/create').post(authService.ensureAuthenticated,BlockController.createBlock);
blockRouter.route('/delete').post(authService.ensureAuthenticated,BlockController.deleteBlock);
blockRouter.route('/get/:secondUser').get(authService.ensureAuthenticated,BlockController.getBlock);
blockRouter.route('/getBlocks').get(authService.ensureAuthenticated,BlockController.getUserBlocks);
module.exports = blockRouter;

