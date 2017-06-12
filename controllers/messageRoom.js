'use strict';

var messageRoomModel = require('..//models/messageRoom');
//var singlemessageModel = require('..//models/message');
//var Message = singlemessageModel.Message;
var MessageRoom = messageRoomModel.MessageRoom;
var messageRoomController = {
    getMessageRoom: getMessageRoom,
    getMessageRooms: getMessageRooms
    
};


function getMessageRoom(req,res){
    var queryObj = {};
    if(req.query.interest){
        queryObj.interest = req.query.interest;
    }
    else if(req.query.postId){
        queryObj.post = req.query.postId;
    }
    
    MessageRoom.findOne(queryObj).populate('post','content').select('-messages').then(function(foundMessageRoom){
        
        if(foundMessageRoom){
            let roomUsers = foundMessageRoom.users;
            if(roomUsers.indexOf(req.user)==-1){
                roomUsers.push(req.user);
                foundMessageRoom.users = roomUsers;
                foundMessageRoom.save();
            }
            res.json({foundMessageRoom:foundMessageRoom});
        }else{
            var newMessageRoom = new MessageRoom();
            newMessageRoom.users = [req.user];
            if(req.query.interest){
                newMessageRoom.interest = req.query.interest;
            }
            else if(req.query.postId){
                newMessageRoom.post = req.query.postId;
            }   
            newMessageRoom.save().then(function(savedMessageRoom){
                res.json({foundMessageRoom:savedMessageRoom});
            }).catch(function(e){
                console.log("get message room new error");
                console.log(e);
            });
        }
    }).catch(function(e){
        console.log("get message room error");
        console.log(e);
    });
}

function getMessageRooms(req, res) {
        
        var queryObj = {};
        var options = {};
        queryObj.users = req.user;
        queryObj["messages.0"]= { "$exists": true };
        options.limit = req.query.limit ? parseInt(req.query.limit) : 20;
        options.sort = req.query.sort ||{
            lastMessageTime: -1 //Sort by Date Added DESC
        };
        options.page = req.query.page || 1;
        options.select = '-messages';
        
        
        
        options.populate = [
            { path: 'lastMessage', model: 'Message', select: 'message type user',populate:[{path:'user',model:'User',select:'anonName picture'}] },
            { path: 'post', model: 'Post', select: 'content image' }
        ];
        
        MessageRoom.paginate(queryObj, options).then(function(messageRooms) {
            res.json(messageRooms);
            
        });
}
   
   
module.exports = messageRoomController;
