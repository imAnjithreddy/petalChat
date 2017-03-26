'use strict';
var express = require('express');

var RevealController = require('../controllers/reveal');
var revealRouter = express.Router();
var authService = require('../services/authentication');



//revealRouter.route('/updateReveal/:reveal_id').reveal(commons.ensureAuthenticated, revealController.updateReveal);
revealRouter.route('/initiate').post(authService.ensureAuthenticated,RevealController.initiate);
revealRouter.route('/accept').post(authService.ensureAuthenticated,RevealController.accept);
revealRouter.route('/ignore').post(authService.ensureAuthenticated,RevealController.ignore);
revealRouter.route('/cancel').post(authService.ensureAuthenticated,RevealController.cancel);
revealRouter.route('/received').get(authService.ensureAuthenticated,RevealController.received);
revealRouter.route('/requested').get(authService.ensureAuthenticated,RevealController.requested);
revealRouter.route('/revealed').get(authService.ensureAuthenticated,RevealController.revealed);
revealRouter.route('/finish').post(authService.ensureAuthenticated,RevealController.finish);
revealRouter.route('/check').get(authService.ensureAuthenticated,RevealController.check);
module.exports = revealRouter;

