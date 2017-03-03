var userModel = require("..//models/user");
var chatModel = require('..//models/chat');
var User = userModel.User;
var Chat = chatModel.Chat;
var chatController = {
    
}

function getChats(req, res) {
        var queryObj = {};
        if (req.query.chatchatRoomID) {
            queryObj.chatRoom = req.query.chatchatRoomID;
        }
        var options ={};
        options.limit = req.query.limit ? parseInt(req.query.limit) : 50;
        options.sort = {
            time: -1
        };
        options.page = req.query.page || 1;
    
        options.populate=[{ path: 'user', select: req.query.revealed?'annoName picture displayName':'annoName picture', model: 'User' }];
        Chat.paginate(queryObj,options).then(function(chats){
            res.json(chats);
        });
            
    }
    

function createChat(req, res) {
        var chat = new Chat();
        var chat2 = new Chat();
        var recData = req.body;
        var io = req.io;
        chat.user = recData.user;
        chat.chatRoom = req.query.chatRoomID;
        chat.message = recData.message;
        chat2.user = recData.user;
        
        chat2.message = recData.message;
        
        chat.save(function(err, savedMessage) {
            if (err) {
                if (err.code == 11000) {
                    return res.json({ success: false, 'message': 'Chat already exists' });
                } else {
                    console.log(err);
                    return res.send(err);
                }
            }
            ChatRoom.findById(chat.chatRoom).exec(function(err, chatRoom) {
                if (err) {
                    console.log(err);
                } else {
                    
                    ChatRoom.find({creator1: chatRoom.creator2,creator2: chatRoom.creator1}).then(function(chatRoom2){
                        chat2.chatRoom = chatRoom2._id;
                        chatRoom2.lastMessage = savedMessage;
                        chatRoom2.lastMessageTime = savedMessage.time;
                        chatRoom2.save();
                        chat2.save();
                    })
                    
                    
                    chatRoom.lastMessage = savedMessage;
                    chatRoom.lastMessageTime = savedMessage.time;
                    chatRoom.save(function(err) {
                        if (err) {
                            console.log(err);
                        }
                        Chat.populate(savedMessage, { path: "user", select: chatRoom.revealed?'displayName picture':'anonName picture' }, function(err, popMessage) {
                            console.log("the saved message");
                            console.log(savedMessage);
                            io.to(req.query.chatRoomID).emit('messageSaved', popMessage);
                            io.to(chatRoom.creator1).emit('newMessageReceived', popMessage);
                            io.to(chatRoom.creator2).emit('newMessageReceived', popMessage);
                            res.json({ message: "Chat createdess" });
                        });

                    });
                }
            });

        });
    });
}

    
    
    