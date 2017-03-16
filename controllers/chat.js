var userModel = require("..//models/user");
var chatModel = require('..//models/chat');
var chatRoomModel = require('..//models/chatRoom');
var User = userModel.User;
var Chat = chatModel.Chat;
var ChatRoom = chatRoomModel.Chat;


var chatController = {
    
}

function getChats(req, res) {
        var queryObj = {};
        if (req.query.chatRoomID) {
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
    
/*

 * create two chats.
 * save both the chats
 * find chatrroms for both users
 * save lastmessage in both the chatrooms
 * populate a chat
 * send to the socket io
*/
function createChat(req, res) {
        var chat = new Chat();
        var chat2 = new Chat();
        var recData = req.body;
        var io = req.io;
        var receiver = recData.receiver;
        chat.user = recData.user;
        chat.type = recData.type;
        chat2.type = chat.type;
        chat.chatRoom = req.query.chatRoomID;
        chat.message = recData.message;
        chat2.user = recData.user;
        chat2.message = recData.message;
        chat.save().then(function(savedMessage) {
            saveChatRoom({_id:chat.chatRoom},savedMessage);
            saveChatRoom({creator1: receiver,creator2: chat.user},savedMessage,function(savedChatRoom){
                chat2.chatRoom = savedChatRoom._id;
                chat2.save();
                sendMessage(req,res,savedMessage,chat.chatRoom,chat.receiver,savedChatRoom._id);    
            });
            
        });
}


function saveChatRoom(queryObj,message,callback){
    ChatRoom.find(queryObj).then(function(chatRoom){
        chatRoom.lastMessage = message;
        chatRoom.lastMessageTime = message.time;
        chatRoom.save().then(function(chatRoom){
            if(callback){
                callback(chatRoom);    
            }
            
        });
    });
}

function sendMessage(req,res,message,senderRoom,receiverID,receiverRoom){
    Chat.populate(message, { path: "user", select: 'anonName picture'}, function(err, popMessage) {
        if(err){
            console.log(err);
            return res.send(err);
        }
        console.log("the saved message");
        console.log(message);
        req.io.to(senderRoom).emit('messageSaved', popMessage);
        req.io.to(receiverRoom).emit('messageReceived',popMessage);
        req.io.to(receiverID).emit('newMessageReceived', popMessage);
        res.json({ message: "Chat created" });
    });
}
    
    
    