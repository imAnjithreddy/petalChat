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
                res.json({token: createJWT(user)});  
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
const createNewUser = async (req,res)=>{
    var user = new User();
    user.unique_id = generateUniqueID();
    user.anonName = generateRandomName();
    
    try{
        user.login_device_token = req.body.profile.device;
        user.gender = "Other";
        user.status = "Hi, I am new to Gossip";
        let savedUser = await user.save();    
        console.log("new user");
        console.log(savedUser);
        res.json({token: createJWT(savedUser)}); 
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
