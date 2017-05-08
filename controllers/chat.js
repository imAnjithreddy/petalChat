'use strict';
var chatModel = require('..//models/chat');
var chatRoomModel = require('..//models/chatRoom');
var notificationController = require('..//controllers/notification');
var Chat = chatModel.Chat;
var ChatRoom = chatRoomModel.ChatRoom;

var chatController = {
    getChats: getChats,
    createChat: createChat,
    
};

function getChats(req, res) {
        var queryObj = {};
        let selectString = 'anonName picture';
        
        queryObj.chatRoom = req.params.roomID;
        
        var options ={};
        options.limit = 15;//req.query.limit ? parseInt(req.query.limit) : 50;
        options.sort = {
            time: -1
        };
        options.page = req.query.page || 1;
        ChatRoom.findById(queryObj.chatRoom).select('revealed').then(function(chatRoom){
            console.log("revealed type "+typeof chatRoom.revealed);
            if(chatRoom.revealed){
                selectString = 'displayName revealedPicture';
            }
            options.populate=[{ path: 'user', select: selectString, model: 'User' }];
                Chat.paginate(queryObj,options).then(function(chats){
                return res.json(chats);
            });
        });
        
            
    }
    
/*

 * create two chats.
 * save both the chats
 * find chatrroms for both users
 * save lastmessage in both the chatrooms
 * populate a chat
 * send to the socket io
*/
function createChat(req, res) {
    
        var recData = req.body;
        var receiver = recData.receiver;
        if(recData.receiver == req.user){
            return res.status(401).send({ message: "wrong access" });
        }
        
        var chat = new Chat();
        var chat2 = new Chat();
        chat.user = req.user;    
        chat.type = recData.type;
        chat2.type = chat.type;
        chat.chatRoom = req.params.roomID;
        chat.message = recData.message;
        chat2.user = req.user;
        chat2.message = recData.message;
        
        chat.save().then(function(savedMessage) {
            saveChatRoom({_id:chat.chatRoom},savedMessage,()=>{});
            
            saveChatRoom({creator1: receiver,creator2: req.user},savedMessage,function(savedChatRoom){
                
                
                chat2.chatRoom = savedChatRoom._id;
                
                chat2.save(function(err,savedChat2){
                    if(err){
                        console.log(err);
                    }
                    
                    sendMessage(req,res,savedChat2,chat.chatRoom,receiver,savedChatRoom);
                });
                
                    
            });
            
        });
}


function saveChatRoom(queryObj,message,callback){
    
    ChatRoom.findOne(queryObj,function(err1,chatRoom){
        
        if(err1){
            console.log("err 89");
            console.log(err1);
            //return res.send({"message":err1});
        }
        /* 
            *For situation when one user has deleted his side of chatbox. 
            *If the second user sends a message then a new chatbox should be created
        */
        
        if(!chatRoom){
            chatRoom = new ChatRoom();
        }
        chatRoom.lastMessage = message;
        chatRoom.lastMessageTime = message.time;
        chatRoom.save(function(err,chatRoomSaved){
            if(err){
                console.log(err);
            }
            
            if(callback){
                callback(chatRoomSaved);    
            }
            
        });
    });
}

function sendMessage(req,res,message,senderRoom,receiverID,receiverRoom){
    var selectString = 'anonName picture';
    if(receiverRoom.revealed){
        selectString = 'displayName facebookName googleName facebookPicture googlePicture  revealedPicture';
    }
    Chat.populate(message, { path: "user", select: selectString}, function(err, popMessage) {
        if(err){
            console.log(err);
            return res.json({message:err});
        }
        req.io.to(senderRoom).emit('messageSaved', popMessage);
        req.io.to(receiverRoom._id).emit('messageReceived',popMessage);
        req.io.to(receiverID).emit('newMessageReceived', popMessage);
        notificationController.sendMessageNotification(receiverID,popMessage);    
        res.json({ message: message });
    });
}
module.exports = chatController;
    
    
    