'use strict';

var userModel = require("..//models/user");
var User = userModel.User;
var gcm = require('node-gcm');
var config = require('../config');
require('dotenv').config();

    
    

var notificationController = {
  sendNotification: sendNotification,
  register: register,
  sendMessageNotification: sendMessageNotification
};
function sendMessageNotification(userId,popMessage){
    let messageContent;
    if(popMessage.type=='img'){
        messageContent = 'New Image';
    }
    else{
        messageContent = popMessage.message;
    }
    sendNotification(userId,{
        title: popMessage.user.anonName||popMessage.user.googleName||popMessage.user.facebookName,
        message: messageContent,
        icon: popMessage.user.facebookPicture||popMessage.user.googlePicture||popMessage.user.picture,
        collapseKey: 'messagefrom'+popMessage.user._id
    });
}
function sendNotification(userId,notificationMessage){
    
    var device_tokens = []; //create array for storing device tokens
    var retry_times = 4; //the number of times to retry sending the message if it fails

    var sender = new gcm.Sender(process.env.PUSH_SEC); //create a new sender
    var message = new gcm.Message(); //create a new message
    message.addNotification({
        title: notificationMessage.title,
        body: notificationMessage.message,
        icon: 'ic_launcher',
        sound: 'notification',
        vibrate:"true"
    });   /*
    message.addData('title',notificationMessage.title );
    message.addData('message', notificationMessage.message);
    message.addData('icon', notificationMessage.icon);
    message.addData('sound', 'notification');*/

    message.collapseKey = notificationMessage.collapseKey; //grouping messages
    message.delayWhileIdle = true; //delay sending while receiving device is offline
    message.timeToLive = 3; //the number of seconds to keep the message on the server if the device is offline

    
    User.findById(userId).then(function(user){
        var device_token = user.device_token;
        device_tokens.push(device_token);

        sender.send(message, device_tokens, retry_times, function(err,result){
            if(err){
                console.log("********line 35 notfication *******");
                console.log(err);
            }
            console.log("notification sent");
            console.log(result);
        });
    });
}
function register(req,res){
    User.findById(req.user).then(function(user){
        if(user){
            user.device_token = req.body.device_token;
            user.save().then(function(savedUser){
                return res.json({'message':'devicetokensaved'});
            });    
        }
        else{
            return res.json({'message':'not registered'});
        }
        
    });    
}
module.exports = notificationController;
