'use strict';

var chatRoomModel = require('..//models/chatRoom');
var singlechatModel = require('..//models/chat');
var Chat = singlechatModel.Chat;
var ChatRoom = chatRoomModel.ChatRoom;
var chatRoomController = {
    getChatRoom: getChatRoom,
    getChatRooms: getChatRooms,
    createOrFindChatRoom: createOrFindChatRoom,
    updateChatRoom: updateChatRoom,
    deleteChatRoom: deleteChatRoom
};


function deleteChatRoom(req,res){
    
    ChatRoom.findOne({_id:req.params.id}).then(function(chatRoom){
        if(chatRoom){
            Chat.find({chatRoom:req.params.id}).then(function(chatRooms){
                        let arrLength = chatRooms.length;
                        for (let i = 0; i < arrLength; i++) {
                            chatRooms[i].remove();
                        }
                    });
            res.json("deleted chatRoom"); /*
            chatRoom.remove(function(err,errdeletedRoom){
                if(err){
                    console.log("error while dlete chatroom");
                    console.log(err);
                }
                else{
                    Chat.find({chatRoom:req.params.id}).then(function(chatRooms){
                        let arrLength = chatRooms.length;
                        for (let i = 0; i < arrLength; i++) {
                            chatRooms[i].remove();
                        }
                    });
                    res.json("deleted chatRoom");    
                }
                
            });*/
        }
    });
}
function createOrFindChatRoom(firstUserID,secondUserID,callBack){
        var creator1,creator2;
        creator1 = firstUserID;
        creator2 = secondUserID;
        var queryObj = {
            creator1: creator1,
            creator2: creator2
        };
        
        ChatRoom.findOne(queryObj,function(err,chatRoom){
            if(err){
                console.log("line 23");
                console.log(err);
            }
            if(!chatRoom){
                
                var chatRoom = new ChatRoom();
                chatRoom.creator1 = creator1;
                chatRoom.creator2 = creator2;
            
            
                chatRoom.save(function(err,savedChatRoom){
                    if(err){
                        console.log(err);
                    }
                    callBack(savedChatRoom);
                });    
            }
            else{
                callBack(chatRoom);    
            }
            
        });
}

function updateChatRoom(req,res){
    console.log("update chat");
    console.log(req.params.id);
    ChatRoom.findById(req.params.id).then(function(chatRoom){
        chatRoom.lastLoggedOut = new Date();
        chatRoom.save(function(err,savedChatRoom){
            if(err){
                return res.json(err);
            }
            //return res.json(savedChatRoom);
            var selectString = 'anonName picture';
             ChatRoom.populate(savedChatRoom, [{ path: "creator2", select: selectString},{ path: "lastMessage"}], function(err, popChatRoom) {
        if(err){
            console.log(err);
            return res.json({message:err});
        }
        console.log("got chatroom");
        console.log(popChatRoom);
        popChatRoom.chats = [];
        res.json(popChatRoom);        
    });
            
            
        });
    });
}
function getChatRoom(req,res){
    
    if(req.user == req.params.user){
        
            return res.status(401).send({ message: "wrong access" });
        
    }
    console.log("in create or find");
    console.log(req.user);
    console.log(req.params.user);
    createOrFindChatRoom(req.user,req.params.user,function(chatRoom){
            createOrFindChatRoom(req.params.user,req.user,function(chatRoom){
                
            });
        
        var selectString = 'anonName picture';
        ChatRoom.populate(chatRoom, [{ path: "creator2", select: selectString},{ path: "lastMessage"}], function(err, popChatRoom) {
        if(err){
            console.log(err);
            return res.json({message:err});
        }
        console.log("got chatroom");
        console.log(popChatRoom);
        popChatRoom.chats = [];
        res.json(popChatRoom);        
    });
        
    });
}

function getChatRooms(req, res) {
        var creator = req.user;
        var queryObj = {};
        var options = {};
        queryObj.creator1 = creator;
        queryObj.revealed = false;
        queryObj["chats.0"]= { "$exists": true };
        options.limit = req.query.limit ? parseInt(req.query.limit,10) : 20;''
        options.sort = req.query.sort ||{
        lastMessageTime: -1 //Sort by Date Added DESC
        };
        options.page = req.query.page || 1;
        options.select = '-chats';
        var userSelectString = 'anonName picture';
        
        
        options.populate = [{ path: 'creator1', model: 'User', select: userSelectString },
                            { path: 'lastMessage', model: 'Chat', select: 'message type user' },
                            { path: 'creator2', model: 'User', select: userSelectString }
        ];
        
        ChatRoom.paginate(queryObj, options).then(function(chatRooms) {
            res.json(chatRooms);
            
        });
}
    module.exports = chatRoomController;
