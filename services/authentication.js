'use strict';
var moment = require('moment');

var jwt = require('jwt-simple');
var config = require('../config');
var User = require('..//models/user').User;
require('dotenv').config();


let cob = {
    
};
cob.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (!req.header('authorization')) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.header('authorization').split(' ')[1];
    //take from cookie
    var payload = null;
    try {
        
        payload = jwt.decode(token, process.env.TOKEN_SEC);
    } catch (err) {
        return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
     User.findById(payload.sub._id).then(function(foundUser){
       //req.user = foundUser;
       next();
    });
    
};

module.exports = cob;