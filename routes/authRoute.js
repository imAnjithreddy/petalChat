'use strict';
var express = require('express');
var authenticateRouter = express.Router();

var models = require('..//models/user');
var qs = require('querystring');
var moment = require('moment');
var request = require('request');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var User = models.User;
var facebookAuth = require('../services/facebookAuth.js');
var googleAuth = require('../services/googleAuth.js');
var nativeGoogleAuth = require('../services/nativeGoogle.js');
var createJWT = require('../services/jwtService.js');


authenticateRouter.route('/auth/facebook')
	.post(facebookAuth);


authenticateRouter.route('/auth/google')
	.post(googleAuth);
authenticateRouter.route('/auth/nativeGoogle')
	.post(nativeGoogleAuth);

authenticateRouter.route('/user/:userId')
	.get(function(req, res) {
		User.findById(req.params.userId)
			.populate([{ path: 'storeId', select: 'name address.area address.locality' }])
			.exec(function(err, user) {
				if (err || !user) {
					return res.status(401).send({ message: 'Invalid emails and/or password' });
				} else {
					res.send({ user: user.toJSON() });
				}
			})


	});


module.exports = authenticateRouter;

//mongod.exe --storageEngine=mmapv1
