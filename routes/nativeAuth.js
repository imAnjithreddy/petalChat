'use strict';
var express = require('express');
var User = require('..//models/user').User;
var createJWT = require('../services/jwtService.js');
var authService = require('../services/authentication');
var moniker = require("moniker");
var nativeAuthRouter = express.Router();

var randomstring = require("randomstring");

const USER_NOT_FOUND = 'USER_NOT_FOUND';

const generateRandomName = ()=>{
    var randomName = moniker.generator([moniker.adjective,moniker.noun]);
    return randomName.choose();
};
const generateUniqueID = ()=>{
    var randomName = moniker.generator([moniker.noun]);
    var randomNumber = randomstring.generate({
        length:'3',
        charset: 'numeric'
    });    
    var uniqueName = (randomName.choose()+randomNumber);
    return uniqueName;
};
const deviceAuth = async (req,res)=>{
    const profile = req.body.profile;
    console.log("profile");
    console.log(profile);
    if(profile.device){
        try{
            let user = await User.findOne({login_device_token: profile.device});
            //let user = await User.findOne({_id: '58f516f69d08b800125a06b5'});
            if(user){
                console.log("from already");
                console.log(user);
                res.json({token: createJWT(user),user:user});  
            }else{
                throw new Error(USER_NOT_FOUND);    
            }
        }
       catch(e){
            if(e.message===USER_NOT_FOUND){
                
                
                createNewUser(req,res);
            }
       }
    }
    
};
const imageArray = ['https://cdn.pixabay.com/photo/2013/07/13/13/38/turtle-161281_960_720.png','https://cdn.pixabay.com/photo/2016/11/21/15/13/blue-1845901_960_720.jpg','https://c1.staticflickr.com/1/159/376591423_c0b3889fc6_b.jpg','https://cdn.pixabay.com/photo/2016/03/31/16/09/batman-1293525_960_720.jpg','https://static.pexels.com/photos/93596/pexels-photo-93596.jpeg','https://static.pexels.com/photos/120222/pexels-photo-120222.jpeg'];
const createNewUser = async (req,res)=>{
    var user = new User();
    user.unique_id = generateUniqueID();
    user.anonName = generateRandomName();
    
    try{
        user.login_device_token = req.body.profile.device;
        user.gender = "Other";
        user.status = "Hi, I am new to Gossip";
        user.picture = imageArray[Math.floor(Math.random() * 6) + 0];
        let savedUser = await user.save();    
        console.log("new user");
        console.log(savedUser);
        res.json({token: createJWT(savedUser),user:user}); 
    }
    catch(err){
         if (err.code && err.code === 11000) {
             createNewUser(req,res);
         }
    }
    
    
};

const userDetails=(req,res)=>{
    console.log(req.user);
    User.findById(req.user).then((user)=>{
        
        res.json({user:user});
    });
};



nativeAuthRouter.route('/device').post(deviceAuth);
nativeAuthRouter.route('/userDetails').get(authService.ensureAuthenticated,userDetails);
module.exports = nativeAuthRouter;
