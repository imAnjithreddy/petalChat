'use strict';

var Upvote = require('..//models/upvote').Upvote;

var Post = require('..//models/post').Post;

var upvoteController = {
  createUpvote: createUpvote,
  getUpvote: getUpvote,
  deleteUpvote: deleteUpvote,
  
};



function createUpvote(req, res) {
  
  var upvote = new Upvote();
  upvote.post = req.params.postId;
  upvote.user = req.user;
 
  upvote.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
      updateUpvoteLength(req.params.postId);
      res.json(result);
    }
  });


}

function getUpvote(req, res) {
  
  Upvote.findOne({post: req.params.postId,user:req.user},function(err,result) {
    if(err){
      console.log(err);
    }
    
    updateUpvoteLength(req.params.postId);
      if(result){
        
        
        res.json(true);
      }
      else{
        res.json(false);
      }
        
      
    });
    
}



function deleteUpvote(req, res) {
    var queryObj = {
        user: req.user,
        post: req.params.postId
    };
  Upvote.findOne(queryObj, function(err,upvote) {
    if (err) {
      console.log(err);
    }
    if(upvote){
      upvote.remove(function(err,removed){
        if(err){
          console.log("line 71");
          console.log(err);
        }
        if(removed){
         
          updateUpvoteLength(req.params.postId);
          res.json({"message":"Upvote has been deleted"});    
        }
      });
      
    }
    
  });
}

function updateUpvoteLength(id){
  Post.findById(id).select('upvotes views').then(function(post){
    
    post.upvotesLength = post.upvotes?post.upvotes.length : 0;
    post.views = post.views+1;
    
    post.save();
  });
}
module.exports = upvoteController;
