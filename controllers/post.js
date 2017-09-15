'use strict';

var Post = require('..//models/post').Post;
var User = require('..//models/user').User;

const saveUserLocation = (req)=>{
  console.log("called save user");
  User.findById(req.user).then((foundUser)=>{
            if(foundUser){
              foundUser.loc = [req.query.longitude,req.query.latitude];  
              foundUser.save();
            }
    });
};


function getLocation(req,error,callback){
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (ip.substr(0, 7) == "::ffff:") {
          ip = ip.substr(7);
        }
          var freegeoip = require('node-freegeoip');
          freegeoip.getLocation(ip, function(err, location) {
            if(err){
              error();
            }
            callback(location);
          });
}
function getNearByPosts(req,res,options,queryObj){
  let maxDistance = (req.query.distance||18)*100;
    			maxDistance /= 6371;
    			queryObj.loc = { $ne: null };
    			options.sort = '-time';
    			queryObj.loc={
    				$near: [req.query.longitude,req.query.latitude],
    				$maxDistance: maxDistance
    			};
    			 options.populate = { path: 'user', model: 'User', select: 'anonName picture status' };
        
        Post.paginate(queryObj, options).then(function(postList) {
            postList.time = new Date();
            return res.json(postList);
        });
}
function getFilteredPosts(req,res,options,queryObj){
  options.populate = { path: 'user', model: 'User', select: 'anonName picture status' };
        
        Post.paginate(queryObj, options).then(function(postList) {
            postList.time = new Date();
            return res.json(postList);
        });
}
function getPosts(req,res){
        
        var queryObj = {};
        var options = {};
        options.limit = 50;//req.query.limit ? parseInt(req.query.limit) : 20;
        options.sort = req.query.sort || null;
        options.page = req.query.page || 1;
        
        if(req.query.user){
          queryObj.user = req.query.user;
          return getFilteredPosts(req,res,options,queryObj);
        }
        else if(req.query.interest){
              queryObj.interests= new RegExp(req.query.interest.toLowerCase(), "i");
              return getFilteredPosts(req,res,options,queryObj);
        }
        else if(req.query.nearby){
    			
    			if(!req.query.latitude ){
    			  console.log("if check");
    			  getLocation(req,function(err){
    			    console.log(err);
    			  },function(location){
    			    req.query.longitude = location.longitude;
    			    req.query.latitude = location.latitude;
    			     if(options.page == 1){
              saveUserLocation(req);
            }
    			   
    			    getNearByPosts(req,res,options,queryObj);
    			    
    			  });
    			}
    			else{
    			  console.log("next else");
    			  let maxDistance = (req.query.distance||18)*100;
      			maxDistance /= 6371;
      			queryObj.loc = { $ne: null };
      			queryObj.loc={
    				  $near: [req.query.longitude,req.query.latitude],
    				  $maxDistance: maxDistance
    			  };
    			  getNearByPosts(req,res,options,queryObj);
    			}
    			
    		  
		    }
		    else{
		      return getFilteredPosts(req,res,options,queryObj);
		    }
        
        
        
}
function generatePostObj(user,item){
  var post = new Post();

  if(item.content){
    post.content = item.content;  
  }
  
  post.user = user;  
  
  if(item.latitude && item.longitude){
    post.loc = [item.longitude,item.latitude];  
  }
  if(item.image){
    post.image = item.image;  
  }
  if( item.imageId){
    post.imageId = item.imageId;  
  }
  if(item.interests && item.interests.length>0){
    post.interests = item.interests.split('#');
    post.interests.splice(0,1);
    post.interests = post.interests.map((interest)=>interest.trim());
  }
  
  return post;


  
}
function createPost(req, res) {
  
  var post = generatePostObj(req.user,req.body.post);
  post.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
      res.json({result:result,message:"post has been created"});
    }
  });


}

function getPost(req, res) {
  Post.findById(req.params.id)
  .populate('user')
    .exec(function(error, result) {
      if (error) {
        console.log("error while reading");
      }
      else {
        savePostViews(req.params.id);
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
  Post.findById(req.params.postId).then( function(post) {
      
      if(post && post.user==req.user){
        post.remove().then(function(deletedPost){
          res.json({"message":"Post has been deleted","deletePost":deletedPost});    
        });
      }
      
    
  });
}

function savePostViews(id){
  Post.findById(id).select('views').then(function(post){
    post.views=post.views+1;
    post.save();
  });
}
const saveViewsPost=(req,res)=>{
  savePostViews(req.params.postId);
};
const submitLike = async (req,res)=>{
  try{
    let foundPost = await Post.findById(req.params.postId);
    let foundUser = await User.findById(req.user);
    if(foundPost && foundUser){
      foundPost.likes.push(req.user);
      foundUser.likes.push(req.params.postId);
      await foundPost.save();
      await foundUser.save();
      updateLikes(req.params.postId);
      res.json({"Message": "Post liked"});
    }
  }catch(e){
    console.log("error in submit like");
    console.log(e);
  }
  
};
const deleteLike = async (req,res)=>{
  try{
    await Post.update( {_id: req.params.postId}, { $pullAll: {likes: [req.user] }} );
    await User.update( {_id: req.user}, { $pullAll: {likes: [req.params.postId] }} );
    updateLikes(req.params.postId);
    res.json({"Message": "Post unliked"});
    
  }catch(e){
    console.log("error in delete like");
    console.log(e);
  }
  
};
const updateLikes = async (postId)=>{
  try{
    let foundPost = await Post.findById(postId);
    if(foundPost){
      
      foundPost.likesLength = foundPost.likes.length;
      foundPost.save();
    }
  }catch(e){
    console.log("error in submit like");
    console.log(e);
  }
};
var postController = {
  createPost: createPost,
  getPost: getPost,
  updatePost: updatePost,
  deletePost: deletePost,
  getPosts: getPosts,
  submitLike: submitLike,
  deleteLike: deleteLike,
  saveViewsPost: saveViewsPost
};
module.exports = postController;
