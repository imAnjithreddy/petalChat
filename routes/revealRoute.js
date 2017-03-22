'use strict';
var express = require('express');

var RevealController = require('../controllers/reveal');
var revealRouter = express.Router();
var authService = require('../services/authentication');



//revealRouter.route('/updateReveal/:reveal_id').reveal(commons.ensureAuthenticated, revealController.updateReveal);
revealRouter.route('/initiate').post(authService.ensureAuthenticated,RevealController.initiateReveal);
revealRouter.route('/accept').post(authService.ensureAuthenticated,RevealController.acceptReveal);
revealRouter.route('/ignore').post(authService.ensureAuthenticated,RevealController.ignoreReveal);
revealRouter.route('/cancel').post(authService.ensureAuthenticated,RevealController.cancelReveal);
module.exports = revealRouter;

