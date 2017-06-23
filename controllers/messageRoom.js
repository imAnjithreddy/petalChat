'use strict';

var messageRoomModel = require('..//models/messageRoom');
//var singlemessageModel = require('..//models/message');
//var Message = singlemessageModel.Message;
var MessageRoom = messageRoomModel.MessageRoom;
var messageRoomController = {
    getMessageRoom: getMessageRoom,
    getMessageRooms: getMessageRooms,
    leaveMessageRoom: leaveMessageRoom,
    createMessageRoom: createMessageRoom,
    getAllMessageRooms: getAllMessageRooms
    
};


function getMessageRoom(req,res){
    var queryObj = {};
    if(req.query.interest){
        queryObj.interest = req.query.interest;
    }
    if(req.query.postId){
        queryObj.post = req.query.postId;
    }
    if(req.query.roomId){
        queryObj._id = req.query.roomId;
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
            if(req.query.postId){
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
        //queryObj["messages.0"]= { "$exists": true };
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

function getAllMessageRooms(req, res) {
        
        var queryObj = {};
        var options = {};
        queryObj["interest"]= { "$exists": true };
        if(req.query.interest){
            queryObj.interest = new RegExp(req.query.interest, 'i');
        }
        options.limit = req.query.limit ? parseInt(req.query.limit) : 20;
        options.page = req.query.page || 1;
        options.select = '-messages';
        
        MessageRoom.paginate(queryObj, options).then(function(messageRooms) {
            res.json(messageRooms);
            
        });
}

function leaveMessageRoom(req, res){
    console.log("entered message room");
    console.log(req.body);
    if(req.body.messageRoomId){
        MessageRoom.findById(req.body.messageRoomId).then(function(messageRoom){
            let users = messageRoom.users;
            let userIndex = users.indexOf(req.user);
            if(userIndex!==-1){
                users.splice(userIndex,1);
                messageRoom.users = users;
                messageRoom.save().then(function(messageRoomSaved){
                    res.json({"Message":"Removed from group"});
                }).catch(function(err){
                    res.json({"Message":err});
                });
            }
        });
    }
}
   
function createMessageRoom(req, res){
    console.log("create message room");
    console.log(req.body);
    var messageRoomInterest = req.body.messageRoom.interest;
    var messageRoomImage = req.body.messageRoom.messageRoomImage;
    MessageRoom.findOne({interest: messageRoomInterest,adminUser:req.user})
        .then(function(foundMessageRoom){
            if(foundMessageRoom){
                res.status(400).send({"Message":"MessageRoom already exists"});
            }else{
                var newMessageRoom = new MessageRoom();
                newMessageRoom.adminUser = req.user;
                newMessageRoom.users = [req.user];
                newMessageRoom.interest = messageRoomInterest;
                newMessageRoom.messageRoomImage = messageRoomImage;
                newMessageRoom.save().then(function(savedMessageRoom){
                    res.json({savedMessageRoom:savedMessageRoom});
                }).catch(function(e){
                    console.log("get message room new error");
                    console.log(e);
                });
            }
        }).catch(function(err){
            console.log("error in finding message room");
            console.log(err);
            res.status(500).send({"Message":"Error in finding message room"});
        });
}
module.exports = messageRoomController;
