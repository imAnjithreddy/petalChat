'use strict';

var jwt = require('jwt-simple');
var models = require('..//models/user');
var User = models.User;
var createJWT = require('./jwtService.js');
var config = require('../config');
require('dotenv').config();
function printReq(req,strings){
    console.log(strings);
    console.log(req.body);
}
module.exports = function(req,res){
    if (req.header('Authorization')) {
        printReq(req,"entered authorization");
        let profile = req.body.profile;
        User.findOne({ google: profile.id }, function(err, existingUser) {
          if(err){
            console.log(err);
          }
          if (existingUser) {
            console.log("existing user");
            console.log("line 19");
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, process.env.TOKEN_SEC);
          User.findById(payload.sub, function(err, user) {
            if(err){
              console.log(err);
            }
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            console.log("line 28");
            user.google = profile.id;
            user.googlePicture =  profile.imageUrl;
            user.googleName =  profile.displayName;
            user.save(function() {
              var token = createJWT(user);
              res.send({user:user.toJSON(), token: token });
            });
          });
        });
      } else {
          printReq(req,"entered non authorization");
          let profile = req.body.profile;
          // Step 3. Create a new user account or return an existing one.
        
          User.findOne({ google: profile.id }, function(err, existingUser) {
            if(err){
              console.log(err);
            }
            if (existingUser) {
              var token = createJWT(existingUser);
              return res.send({user:existingUser.toJSON(), token: token });
            }
            var user = new User();
            user.google = profile.id;
            user.googlePicture =  profile.imageUrl;
            user.googleName =  profile.displayName;
            user.gender = 'Other';
            user.status = "Hi, I am new to Petal Chat";
            user.picture = 'https://api.adorable.io/avatars/285/'+user.anonName+'.png';
            user.save(function() {
              var token = createJWT(user);
              res.send({ user:user.toJSON(),token: token });
            });
          });
      }
};
