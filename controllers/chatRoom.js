var chatModel = require('..//models/chatRoom');
var userModel = require("..//models/user");
var User = userModel.User;
var ChatRoom = chatModel.ChatRoom;
var chatRoomController = {
    getChatRoom: getChatRoom,
    getChatRooms: getChatRooms
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
        }).catch(function(){
            console.log("from chatroom 22");
    console.log(creator1);
    console.log(creator2);
            var chatRoom = new ChatRoom();
            chatRoom.creator1 = creator1;
            chatRoom.creator2 = creator2;
            
            
            chatRoom.save().then(function(savedChatRoom){
                callBack(savedChatRoom);
            });
        });
}


function getChatRoom(req,res){
    
    if(req.user == req.params.user){
        
            return res.status(401).send({ message: "wrong access" });
        
    }
    createOrFindChatRoom(req.user,req.params.user,function(chatRoom){
        if(!chatRoom.chats){
            createOrFindChatRoom(req.params.user,req.user,function(chatRoom){
            });
        }
        res.json(chatRoom);        
    });
}

function getChatRooms(req, res) {
        var creator = req.user;
        var queryObj = {};
        var options = {};
        queryObj.creator1 = creator;
        
        options.limit = req.query.limit ? parseInt(req.query.limit) : 20;
        options.sort = req.query.sort ||{
        lastMessageTime: -1 //Sort by Date Added DESC
        };
        options.page = req.query.page || 1;
        options.select = '-chats';
        var userSelectString = ' anonName picture ';
        console.log(typeof req.query.revealed);
        if(req.query.revealed=='true'){
            queryObj.revealed = true;
            console.log("hsdfjsdhfhsdf");
            userSelectString = 'displayName picture revealedPicture';
        }
        options.populate = [{ path: 'creator1', model: 'User', select: userSelectString },
                            { path: 'lastMessage', model: 'Chat', select: 'message ' },
                            { path: 'creator2', model: 'User', select: userSelectString }
        ];
        
        ChatRoom.paginate(queryObj, options).then(function(chatRooms) {
            res.json(chatRooms);
            
        });
}
    module.exports = chatRoomController;
