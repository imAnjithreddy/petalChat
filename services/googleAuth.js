'use strict';
var qs = require('querystring');
var request = require('request');
var jwt = require('jwt-simple');
var models = require('..//models/user');
var config = require('../config');
var User = models.User;
var createJWT = require('./jwtService.js');

require('dotenv').config();

    

module.exports = function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.GOOGLE_SEC,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if(err){
            
            console.log(err);
          }
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          
          var payload = jwt.decode(token, process.env.TOKEN_SEC);
          User.findById(payload.sub, function(err, user) {
            if(err){
              console.log("error in lne 44-");
              console.log(err);
            }
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.googlePicture =  profile.picture.replace('sz=50', 'sz=200');
            user.googleName =  profile.name;
            user.save(function() {
              var token = createJWT(user);
              
              
              return res.send({user:user.toJSON(), token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if(err){
            console.log("error in line 61");
            console.log(err);
          }
          if (existingUser) {
            var token = createJWT(existingUser);
            
            return res.send({user:existingUser.toJSON(), token: token });
          }
          var user = new User();
          user.google = profile.sub;
          user.googlePicture =  profile.picture.replace('sz=50', 'sz=200');
            user.googleName =  profile.name;
          user.save(function(err,savedUser) {
            if(err){
              console.log("error in 75");
              console.log(err);
            }
            else{
              var token = createJWT(savedUser);
              return res.send({user:savedUser.toJSON(), token: token });  
            }
            
          });
        });
      }
    });
  });
};