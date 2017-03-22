'use strict';
var qs = require('querystring');
var request = require('request');
var jwt = require('jwt-simple');
var models = require('..//models/user');
var User = models.User;
var createJWT = require('./jwtService.js');
var config = require('../config');
//shopuae
//var clientSecret = '34684e0d31a4f347e54e4a53dbbd5af4';

//shoppinss
var clientSecret = config.secret.facebook;
module.exports =  function(req, res) {
  
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: clientSecret,
    redirect_uri: req.body.redirectUri 
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    
    if (response.statusCode !== 200) {
      
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      
      if (response.statusCode !== 200) {
      
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.header('Authorization')) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.secret.token);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.verified = true;
            user.facebookPicture =  'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.facebookName =  profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({user:user.toJSON(), token: token });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({user:existingUser.toJSON(), token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.facebookPicture =  'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.facebookName =  profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ user:user.toJSON(),token: token });
          });
        });
      }
    });
  });
}



