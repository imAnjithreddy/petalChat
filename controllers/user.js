'use strict';

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
function sliceUsers(page,limit,list,anon){
  let sliceStart = (page-1)*limit;
  let sliceEnd = limit*page;
  let newList=[];
  list.slice(sliceStart,sliceEnd).forEach(function(i){
    i.posts=undefined;
    let x;
    if(anon == 'requested'){
      x = i.requested;
    }
    else if(anon == 'received'){
      x = i.requester;
    }
    else{
       newList.push(i);
    }
    if(anon){
       x.googleName = undefined;
       x.facebookName = undefined;
       x.googlePicture = undefined;
       x.facebookPicture = undefined;
       x.google = undefined;
       x.facebook = undefined;
       x.revealedPicture = undefined;
       newList.push(x);
    }  
      
    
    
    
  });
  
  return {total:list.length,docs:newList};
}
function getNearByUsers(req,res,options,queryObj){
  queryObj.loc = { $ne: null };
      			let maxDistance = req.query.distance*100;
      			maxDistance /= 6371;
      			queryObj.loc={
      				$near: [req.query.longitude,req.query.latitude],
      				$maxDistance: maxDistance
      			};
      			User.paginate(queryObj, options).then(function(userList) {
      			    userList.time = new Date();
                res.json(userList);
            });  
}
function getUsers(req,res){
        var queryObj = {};
        var options = {};
        options.limit = req.query.limit ? parseInt(req.query.limit,10) : null;
        options.sort = req.query.sort || null;
        options.page = req.query.page || null;
        options.select = 'anonName status picture loc interests gender';    
        
        if(req.query.all){
            if(req.query.interest){
             queryObj.$or =  [
               {interests: new RegExp(req.query.interest.toLowerCase(), "i") },
              {anonName: new RegExp(req.query.interest.toLowerCase(), "i") }
              ];
            }
            options.sort='anonName';
            
            User.paginate(queryObj, options).then(function(userList) {
              return res.json(userList);
            });
        }
        else if(req.query.nearby){
          if(req.query.latitude){
            queryObj.loc = { $ne: null };
      			let maxDistance = req.query.distance*100;
      			maxDistance /= 6371;
      			queryObj.loc={
      				$near: [req.query.longitude,req.query.latitude],
      				$maxDistance: maxDistance
      			};
      			console.log("options page");
      			console.log(options.page);
      			if(options.page == 1){
              saveUserLocation(req);
            }
      			User.paginate(queryObj, options).then(function(userList) {
      			    userList.time = new Date();
                res.json(userList);
            });  
          }
          else{
            getLocation(req,function(err){
    			    console.log(err);
    			  },function(location){
    			    req.query.longitude = location.longitude;
    			    req.query.latitude = location.latitude;
    			    if(options.page == 1){
              saveUserLocation(req);
            }
    			    getNearByUsers(req,res,options,queryObj);
    			  });
          }
          
		    }
        
}
function generateUserObj(item,existingUser){
  
  var user = existingUser || new User();  
  //console.log("")
  //Object.keys(item);
  
  
  if(item.picture){
    if(item.picture.startsWith("http")){
      user.picture = item.picture;    
    }
    
  }
  
  if(item.gender){
    user.gender = item.gender;  
  }
  
  if(item.hasOwnProperty('status')){
    console.log("user status222222");
    console.log(item.status);
    user.status = item.status;  
  }
  
  if(item.anonName){
    user.anonName = item.anonName;
  }
  
  if(item.age){
    user.age = item.age;
  }
  if(item.latitude && item.longitude){
    user.loc = [item.longitude,item.latitude];  
  }
  if(item.hasOwnProperty('interests')){
    if(item.interests.length>0){
      user.interests = item.interests.split('#');
    user.interests.splice(0,1);
    user.interests = user.interests.map((interest)=>interest.trim());  
    }
    else{
      user.interests = [];
    }
    
  }
  return user;


  
}
function createUser(req, res) {
  
  var user = generateUserObj(req.body.user);
  user.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
      res.json(result);
    }
  });


}
function getUser(req, res) {
  
  if(req.user == req.params.id){
    revealedUser(req.user,res);
  }
  else{
    console.log("anon user");
    anonUser(req.params.id,res);
    
      
  }
  
}
function revealedUser(id,res){
  User.findById(id)
    .then(function(result) {
        return res.json(result);
    });  
}
function anonUser(id,res){
  User.findById(id)
    .select(' -revealedPicture').then(function(result) {
        
        return res.json(result);
    });  
}
function updateUser(req, res) {
	
  User.findById(req.user, function(err, foundUser) {
    if (err) {
    	console.log("hit the empty user");
    	console.log(err);
      
    }
    if(foundUser){
      console.log("the requested object");
      console.log(req.body.user);
      var user = generateUserObj(req.body.user,foundUser);
      
      user.save(function(err, result) {
        if (err) {
          console.log(err);
        }
        return res.json(result);
      });
    }
      
    
  });
}
function deleteUser(req, res) {

  User.findById(req.params.userId, function(err, user) {
    if (err) {
      console.log(err);
    }
    else {

    }
  });
}
function getMyFollowers(req,res){
  User.find({following: req.user}).exec(function(err, users) { 
    if(err){
      
    }
    if(users){
      res.json({followers: users});
    }
    
  });
}
function getMyFollowing(req,res){
  User.findById(req.user).populate({ path:'following'  }).exec(function(err, user) {
  if (err) {
    // handle err
  }
  if (user) {
    res.json({following: user.following});
     // user.following[] <-- contains a populated array of users you're following
  }
});
}


const submitFollowing = async (req,res)=>{
  try{
    let foundUser = await User.findById(req.user);
    let foundUser2 = await User.findById(req.params.userId);
    if(foundUser && foundUser2){
      foundUser.following.push(req.params.userId);
      foundUser2.followers.push(req.user);
      await foundUser.save();
      await foundUser2.save();
      res.json({"Message": "User followed"});
    }
  }catch(e){
    console.log("error in submit following");
    console.log(e);
  }
  
};
const deleteFollowing = async (req,res)=>{
  try{
    await User.update( {_id: req.user}, { $pullAll: {following: [req.params.userId] } } );
    await User.update( {_id: req.params.userId}, { $pullAll: {followers: [req.user] } } );
    
    res.json({"Message": "User unfollowed"});
    
  }catch(e){
    console.log("error in delete following");
    console.log(e);
  }
  
};


var userController = {
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUsers: getUsers,
  getMyFollowers: getMyFollowers,
  getMyFollowing: getMyFollowing,
  submitFollowing: submitFollowing,
  deleteFollowing: deleteFollowing
};

module.exports = userController;


