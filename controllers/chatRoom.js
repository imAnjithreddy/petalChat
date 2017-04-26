var chatModel = require('..//models/chatRoom');
var userModel = require("..//models/user");
var User = userModel.User;
var ChatRoom = chatModel.ChatRoom;
var chatRoomController = {
    getChatRoom: getChatRoom,
    getChatRooms: getChatRooms,
    createOrFindChatRoom: createOrFindChatRoom,
    updateChatRoom: updateChatRoom
};

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
    ChatRoom.findById(req.params.id).then(function(chatRoom){
        chatRoom.lastLoggedOut = new Date();
        chatRoom.save(function(err,savedChatRoom){
            if(err){
                return res.json(err);
            }
            return res.json(savedChatRoom);
        })
    })
}
function getChatRoom(req,res){
    
    if(req.user == req.params.user){
        
            return res.status(401).send({ message: "wrong access" });
        
    }
    createOrFindChatRoom(req.user,req.params.user,function(chatRoom){
            createOrFindChatRoom(req.params.user,req.user,function(chatRoom){
                
            });
        
        res.json(chatRoom);        
    });
}

function getChatRooms(req, res) {
        var creator = req.user;
        var queryObj = {};
        var options = {};
        queryObj.creator1 = creator;
        queryObj.revealed = false;
        queryObj["chats.0"]= { "$exists": true };
        options.limit = req.query.limit ? parseInt(req.query.limit) : 20;
        options.sort = req.query.sort ||{
        lastMessageTime: -1 //Sort by Date Added DESC
        };
        options.page = req.query.page || 1;
        options.select = '-chats';
        var userSelectString = ' anonName picture ';
        
        if(req.query.revealed=='true'){
            queryObj.revealed = true;
            userSelectString = 'displayName picture googlePicture facebookPicture googleName facebookName revealedPicture';
        }
        options.populate = [{ path: 'creator1', model: 'User', select: userSelectString },
                            { path: 'lastMessage', model: 'Chat', select: 'message type user' },
                            { path: 'creator2', model: 'User', select: userSelectString }
        ];
        
        ChatRoom.paginate(queryObj, options).then(function(chatRooms) {
            res.json(chatRooms);
            
        });
}
    module.exports = chatRoomController;
