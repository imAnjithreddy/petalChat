var models = require('..//models/user');
var chatRoomController = require("./chatRoom");
var User = models.User;
var revealController = {
    
};

module.exports = revealController;


function initiateReveal(req,res){
    var firstUserID = req.query.firstUser;
    var secondUserID = req.query.secondUser;
    var secondUserOptions = {};
    secondUserOptions.select = 'revealReceived';
    
    var firstUserOptions = {};
    firstUserOptions.select = 'revealRequested';
    
    
    User.findById(firstUserID,firstUserOptions).then(function(firstUser){
        User.findById(secondUserID,secondUserOptions).then(function(secondUser){
            if( firstUser.revealRequested.indexOf(secondUserID)==-1 ){
                if(secondUser.revealReceived.indexOf(firstUserID)==-1){
                    if(firstUser.revealRequested.length<=25){
                        firstUser.revealRequested.push(secondUserID);
                        secondUser.revealReceived.push(firstUserID);
                        firstUser.save().then(function(firstUserSaved){
                            secondUser.save().then(function(secondUserSaved){
                                res.json({"message":"Request sent. Number of Requests left"+(25-firstUser.revealRequested.length)});                            
                            });
                        });
                    }
                    else{
                        res.json({"message":"You have crossed the limit of requesting"});
                    }
                }
            }
        });
    });
}

function cancelReveal(req,res){
    var firstUserID = req.query.firstUser;
    var secondUserID = req.query.secondUser;
    var secondUserOptions = {};
    secondUserOptions.select = 'revealReceived';
    var firstUserOptions = {};
    firstUserOptions.select = 'revealRequested';
     User.findById(firstUserID,firstUserOptions).then(function(firstUser){
        User.findById(secondUserID,secondUserOptions).then(function(secondUser){
            var revealRequestedIndex = firstUser.revealRequested.indexOf(secondUserID);
            var revealReceivedIndex = secondUser.revealReceived.indexOf(firstUserID);
            if( revealRequestedIndex!=-1 && revealReceivedIndex !=-1){
                firstUser.revealRequested.splice(revealRequestedIndex,1);
                secondUser.revealReceived.splice(revealReceivedIndex,1);
                firstUser.save().then(function(firstUserSaved){
                            secondUser.save().then(function(secondUserSaved){
                                
                                
                                chatRoomController.createOrFindChatRoom(secondUserID,firstUserID,function(chatRoom){
                                    chatRoom.revealed = false;
                                    chatRoom.save();
                                });
                                
                                chatRoomController.createOrFindChatRoom(firstUserID,secondUserID,function(chatRoom){
                                    chatRoom.revealed = false;
                                    chatRoom.save().then(function(){
                                        res.json({"message":"Request Cancelled.Number of Requests left"+(25-firstUser.revealRequested.length)});  
                                    });
                                });
                                
                            });
                        });
            }
            else{
                res.json({"message":"Cancellation Failed. Try Again!"});
            }
        });
    });
    
}

function acceptReveal(req,res){
    /*firstUser is the one who initated the request,
        second user is going to accept it.
    */
    var firstUserID = req.query.firstUser;
    var secondUserID = req.query.secondUser;
    
    var firstUserOptions = {};
    firstUserOptions.select = 'revealRequested revealed';
    
    var secondUserOptions = {};
    secondUserOptions.select = 'revealReceived revealed';
    
     User.findById(firstUserID,firstUserOptions).then(function(firstUser){
        User.findById(secondUserID,secondUserOptions).then(function(secondUser){
            var firstUserRevealedIndex = firstUser.revealed.indexOf(secondUserID);
            var secondUserRevealedIndex = firstUser.revealed.indexOf(firstUserID);
            var revealRequestedIndex = firstUser.revealRequested.indexOf(secondUserID);
            var revealReceivedIndex = secondUser.revealReceived.indexOf(firstUserID);
            if(firstUserRevealedIndex == -1 && secondUserRevealedIndex == -1){
                if( revealRequestedIndex!=-1 && revealReceivedIndex !=-1){
                    firstUser.revealed.push(secondUserID);
                    secondUser.revealed.push(firstUserID);
                    firstUser.revealRequested.splice(revealRequestedIndex,1);
                    secondUser.revealReceived.splice(revealReceivedIndex,1);
                    firstUser.save().then(function(firstUserSaved){
                            secondUser.save().then(function(secondUserSaved){
                                
                                
                                chatRoomController.createOrFindChatRoom(secondUserID,firstUserID,function(chatRoom){
                                    chatRoom.revealed = true;
                                    chatRoom.save();
                                });
                                
                                chatRoomController.createOrFindChatRoom(firstUserID,secondUserID,function(chatRoom){
                                    chatRoom.revealed = true;
                                    chatRoom.save().then(function(){
                                        res.json({"message":"Request Accpeted."});  
                                    });
                                });
                                              
                            });
                        });
                }
                else{
                    res.json({"message":"Cannot Accept. Try Again!"});
                }    
            }
            else{
                 res.json({"message":"Cannot Accept. Try Again!"});
            }
            
        });
    });
    
    
}

function ignoreReveal(req,res){
    cancelReveal(req,res);
}

function getRevealRequests(req,res){
       /*firstUser is the one who initated the request,
        second user is going to accept it.
    */
    var firstUserID = req.query.firstUser;
    var firstUserOptions = {};
    firstUserOptions.select = 'revealRequested';
    var queryObj = {};
    var options = {};
    options.limit = req.query.limit ? parseInt(req.query.limit) : 10;
    options.sort = req.query.sort || null;
    options.page = req.query.page || 1;
    options.select = '-facebook -displayName' ;
    User.findById(firstUserID,firstUserOptions).then(function(firstUser){
        queryObj._id =  { $in: firstUser.revealRequested};
        User.paginate(queryObj, options).then(function(revealedList){
            res.json(revealedList);
        });
    });
}

function getRevealReceives(req,res){
    var firstUserID = req.query.firstUser;
    var firstUserOptions = {};
    firstUserOptions.select = 'revealReceived';
    var queryObj = {};
    var options = {};
    options.limit = req.query.limit ? parseInt(req.query.limit) : null;
    options.sort = req.query.sort || null;
    options.page = req.query.page || null;
    options.select = '-facebook -displayName' || null;
    User.findById(firstUserID,firstUserOptions).then(function(firstUser){
        queryObj._id =  { $in: firstUser.revealReceived};
        User.paginate(queryObj, options).then(function(revealedList){
            res.json(revealedList);
        });
    });
}

function getReveals(req,res){
    var firstUserID = req.query.firstUser;
    var firstUserOptions = {};
    firstUserOptions.select = 'revealed';
    var queryObj = {};
    var options = {};
    options.limit = req.query.limit ? parseInt(req.query.limit) : null;
    options.sort = req.query.sort || null;
    options.page = req.query.page || null;
    options.select = req.query.fields || null;
    User.findById(firstUserID,firstUserOptions).then(function(firstUser){
        queryObj._id =  { $in: firstUser.revealed};
        User.paginate(queryObj, options).then(function(revealedList){
            res.json(revealedList);
        });
    });
}

/*
$or: [
          { $and: [{creator1: req.query.firstUser}, {creator2: { $in: firstUser.revealed}}] },
          { $and: [{creator2: req.query.firstUser}, {creator1: { $in: firstUser.revealed}}] }
      ]*/


