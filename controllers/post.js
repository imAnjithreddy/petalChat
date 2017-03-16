'use strict';

var Post = require('..//models/post').Post;



var postController = {
  createPost: createPost,
  getPost: getPost,
  updatePost: updatePost,
  deletePost: deletePost,
  getPosts: getPosts
};


function getPosts(req,res){
        var queryObj = {};
        var options = {};
        options.limit = req.query.limit ? parseInt(req.query.limit) : null;
        options.sort = req.query.sort || null;
        options.page = req.query.page || null;
        if(req.query.rating){
          /*add code to sort by rating*/
        }
        if(req.query.interest){
          queryObj.interest = req.query.interest;
        }
        if(req.query.user){
          queryObj.user = req.query.user;
        }
        if(req.query.nearby){
			let maxDistance = req.query.distance || 8;
			maxDistance /= 6371;
			queryObj.loc={
				$near: [req.query.longitude,req.query.latitude],
				$maxDistance: maxDistance
			};
		}
        
        options.populate = [{ path: 'user', model: 'User', select: 'anonName picture' }];
        
        Post.paginate(queryObj, options).then(function(postList) {
            res.json(postList);
        });
        
}
function generatePostObj(item){
  var post = new Post();

  if(item.content){
    post.content = item.content;  
  }
  if(item.user){
    post.user = item.user;  
  }
  if(item.latitude && item.longitude){
    post.loc = [item.longitude,item.latitude];  
  }
  if(item.interests){
    post.interests = item.interests;  
  }
  
  return post;


  
}
function createPost(req, res) {
  
  var post = generatePostObj(req.body.post);
  post.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
      res.json(result);
    }
  });


}

function getPost(req, res) {
  Post.findById(req.params.postId)
    .select(req.query.select)
    .exec(function(error, result) {
      if (error) {
        console.log("error while reading");
      }
      else {
        res.json(result);
      }
    });
}

function updatePost(req, res) {
	
  Post.findById(req.params.post_id, function(err, post) {
    if (err) {
    	console.log("hit the empty post");
    	console.log(err);
      
    }
      
      var post = generatePostObj(req.body.post);
      post.save(function(err, result) {
        if (err) {
          console.log(err);
        }
        res.json(result);
      });
    
  });
}

function deletePost(req, res) {

  Post.findById(req.params.postId, function(err, post) {
    if (err) {
      console.log(err);
    }
    else {

    }
  });
}


module.exports = postController;
