'use strict';

var Block = require('..//models/block').Block;

var User = require('..//models/user').User;

var blockController = {
  createBlock: createBlock,
  getBlock: getBlock,
  deleteBlock: deleteBlock,
  getUserBlocks: getUserBlocks
};


function getUserBlocks(req,res){
    Block
        .find({user1:req.user})
        .populate({path:'user2',select:'anonName _id picture status'})
        .then(function(users){
            if(users){
                res.json(users);
            }   
        });
    
}
function createBlock(req, res) {
  
  var block = new Block();
  block.user2 = req.body.secondUser;
  block.user1 = req.user;
 
  block.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
        if(result){
            deleteFriendship(req.user,req.body.secondUser);
            res.json("User blocked");      
        }  
      
    }
  });


}

function deleteFriendship(user1,user2){
    
    User.cancelRequest(user1,user2);
    User.denyRequest(user1,user2);
    User.endFriendship(user1,user2);
}
function getBlock(req, res) {
  var queryObj = {
      $or: [
          {user1: req.user,user2: req.params.secondUser },
          {user1: req.params.secondUser,user2: req.user }
      ]
  };
  console.log(queryObj);
  Block.findOne(queryObj,function(err,result) {
    if(err){
      console.log(err);
    }
    else{
      if(result){
        res.json({blocked:true});
      }
      else{
        res.json({blocked:false});
      }  
    }
      
    });
    
}


function deleteBlock(req, res) {
    var queryObj = {
        user1: req.user,
        user2: req.body.secondUser
    };
  Block.findOne(queryObj, function(err,block) {
    if (err) {
      console.log(err);
    }
    if(block){
      block.remove(function(err,removed){
        if(err){
          console.log("line 71");
          console.log(err);
        }
        if(removed){
          res.json({"message":"Block has been deleted"});    
        }
      });
      
    }
    
  });
}


module.exports = blockController;
