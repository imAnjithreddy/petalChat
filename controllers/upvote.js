'use strict';

var Upvote = require('..//models/post').Upvote;



var upvoteController = {
  createUpvote: createUpvote,
  getUpvote: getUpvote,
  deleteUpvote: deleteUpvote,
  
};



function createUpvote(req, res) {
  
  var upvote = new Upvote();
  upvote.post = req.params.postId;
  upvote.user = req.user;
  console.log("from the upvote");
  console.log(upvote);
  upvote.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
      res.json(result);
    }
  });


}

function getUpvote(req, res) {
  Upvote.findOne({post: req.params.postId,user:req.user})
    .then(function(result) {
      
        res.json(result);
      
    }).catch(function(err){
        console.log("upvote get error line 42 ");
        console.log(err);
    });
}



function deleteUpvote(req, res) {
    var queryObj = {
        user: req.user,
        post: req.params.postId
    };
  Upvote.findOneAndRemove(queryObj, function(err,upvote) {
    if (err) {
      console.log(err);
    }
    else {
      res.json({"message":"Upvote has been deleted"});
    }
  });
}


module.exports = upvoteController;
