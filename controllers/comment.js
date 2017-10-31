'use strict';

var Comment = require('..//models/comment').Comment;

var Post = require('..//models/post').Post;

var commentController = {
  createComment: createComment,
  getComments: getComments,
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

function getComments(req,res){
    var queryObj = {
         post: req.params.postId
     };
     var options = {};
     options.limit =  20;
     options.sort = '-time';
     options.page = req.query.page || 1;
     options.populate = { path: 'user', model: 'User', select: 'anonName picture' };
     Comment.paginate(queryObj, options).then(function(commentList) {
         return res.json(commentList);
     });
}
/*
function getComments(req, res) {
  
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

*/

function deleteComment(req, res) {
  Comment.findById(req.params.commentId, function(err,comment) {
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
  Post.findById(id).select('comments').then(function(post){
    post.commentsLength = post.comments?post.comments.length : 0;
    post.save();
  });
}
module.exports = commentController;
