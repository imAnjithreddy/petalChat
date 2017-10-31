'use strict';

var Comment = require('..//models/comment').Comment;

var Post = require('..//models/post').Post;

var commentController = {
  createComment: createComment,
  getComment: getComment,
  deleteComment: deleteComment,
  
};



function createComment(req, res) {
  
  var comment = new Comment();
  comment.post = req.params.postId;
  comment.user = req.user;
 comment.content = req.body.content;
  comment.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
      updateCommentLength(req.params.postId);
      res.json(result);
    }
  });


}

function getComment(req, res) {
  
  Comment.findOne({post: req.params.postId,user:req.user},function(err,result) {
    if(err){
      console.log(err);
    }
    
    updateCommentLength(req.params.postId);
      if(result){
        
        
        res.json(true);
      }
      else{
        res.json(false);
      }
        
      
    });
    
}



function deleteComment(req, res) {
    var queryObj = {
        
        _id: req.params.commentId
    };
  Comment.findOne(queryObj, function(err,comment) {
    if (err) {
      console.log(err);
    }
    if(comment){
      comment.remove(function(err,removed){
        if(err){
          console.log("line 71");
          console.log(err);
        }
        if(removed){
         
          updateCommentLength(req.params.postId);
          res.json({"message":"Comment has been deleted"});    
        }
      });
      
    }
    
  });
}

function updateCommentLength(id){
  Post.findById(id).select('comments views').then(function(post){
    
    post.commentsLength = post.comments?post.comments.length : 0;
    post.views = post.views+1;
    
    post.save();
  });
}
module.exports = commentController;
