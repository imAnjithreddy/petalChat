var chatModel = require('..//models/chatRoom');
var userModel = require("..//models/user");
var User = userModel.User;
var ChatRoom = chatModel.ChatRoom;
var chatRoomController = {
    createOrFindChatRoom: createOrFindChatRoom
};

function createOrFindChatRoom(firstUserID,secondUserID,callBack){
        var creator1,creator2;
        creator1 = firstUserID;
        creator2 = secondUserID;
        
        
        var queryObj = {
            creator1: creator1,
            creator2: creator2
        }
        ChatRoom.findOne(queryObj).then(function(chatRoom){
            callBack(chatRoom);
        },function(){
            var chatRoom = new ChatRoom();
            chatRoom.creator1 = creator1;
            chatRoom.creator2 = creator2;
            chatRoom.save().then(function(savedChatRoom){
                callBack(savedChatRoom);
            });
        });
}


function getChatRoom(req,res){
    createOrFindChatRoom(req.query.secondUser,req.query.firstUser,function(chatRoom){
        
    });
    createOrFindChatRoom(req.query.firstUser,req.query.secondUser,function(chatRoom){
        res.json(chatRoom);
    });
    
}

function userChatRooms(req, res) {
        var creator = req.params.creatorId;
        var queryObj = {};
        var options = {};
        options.limit = req.query.limit ? parseInt(req.query.limit) : 20;
        options.sort = req.query.sort ||{
        lastMessageTime: -1 //Sort by Date Added DESC
        };
        options.page = req.query.page || 1;
        options.select = '-chats';
        options.populate = [{ path: 'creator1', model: 'User', select: 'anonName picture' },
                            { path: 'lastMessage', model: 'Chat', select: 'message ' },
                            { path: 'creator2', model: 'User', select: 'anonName picture' }
        ];
        queryObj.creator1 = creator ;
        queryObj.revealed = req.query.revealed;
        ChatRoom.paginate(queryObj, options).then(function(chatRooms) {
            res.json(chatRooms);
            
        });
}
    module.exports = chatRoomController;
