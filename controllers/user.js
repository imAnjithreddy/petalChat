'use strict';

var User = require('..//models/user').User;

var mongoose = require('mongoose');

var userController = {
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUsers: getUsers
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
        options.limit = req.query.limit ? parseInt(req.query.limit) : null;
        options.sort = req.query.sort || null;
        options.page = req.query.page || null;
        options.select = 'anonName status picture loc interests gender';    
        
        if(!!req.query.revealed){
          User.getFriends(mongoose.Types.ObjectId(req.user),function(err,list){
            if(err){
              console.log(err);
            }
              return res.json(sliceUsers(options.page,options.limit,list));
          });
         
           
        }
        else if(req.query.received ){
          User.getReceivedRequests(mongoose.Types.ObjectId(req.user),function(err,list){
            if(err){
              console.log(err);
            }
            
           
              return res.json(sliceUsers(options.page,options.limit,list,'received'));
          });
          
        }
        else if(req.query.requested){
          User.getSentRequests(mongoose.Types.ObjectId(req.user),function(err,list){
            if(err){
              console.log(err);
            }
              return res.json(sliceUsers(options.page,options.limit,list,'requested'));
          });
          
        }
        else if(req.query.all){
            if(req.query.interest){
             queryObj.interests = new RegExp(req.query.interest.toLowerCase(), "i");
            }
            let randomSort = 4;//Math.floor(Math.random() * 5) + 1;
            if(randomSort==1){
              options.sort='-facebookName';
            }
            else if(randomSort==2){
              options.sort='facebookName';
            }
            else if(randomSort==3){
              options.sort='anonName';
            }
            else if(randomSort==4){
              options.sort='facebook';
            }
            else if(randomSort==5){
              options.sort='-facebook';
            }
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
    			    getNearByUsers(req,res,options,queryObj);
    			  });
          }
          
		    }
        //options.populate = req.query.populate || null;
}
function generateUserObj(item,existingUser){
  
  var user = existingUser || new User();  
  //console.log("")
  //Object.keys(item);
  
  
  if(item.picture){
    user.picture = item.picture;  
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
  if(item.latitude && item.longitude){
    console.log("the latitude and longitude");
    console.log(item.latitude+"::"+item.longitude);
    user.loc = [item.longitude,item.latitude];  
  }
  if(item.hasOwnProperty('interests')){
    if(item.interests.length>0){
      user.interests = item.interests.split('!');
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
    User.areFriends( mongoose.Types.ObjectId(req.user),  mongoose.Types.ObjectId(req.params.id),function(err,friends){
      if(err){
        console.log(err);
      }
      if(friends){
          revealedUser(req.params.id,res);
        }
        else{
          anonUser(req.params.id,res);
        }
    });
      
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
    .select('-facebook -google -facebookName -facebookPicture -googleName -googlePicture -revealedPicture').then(function(result) {
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


module.exports = userController;


