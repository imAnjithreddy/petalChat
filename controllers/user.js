'use strict';

var User = require('..//models/user').User;



var userController = {
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUsers: getUsers
};


function getUsers(req,res){
        var queryObj = {};
        var options = {};
        options.limit = req.query.limit ? parseInt(req.query.limit) : null;
        options.sort = req.query.sort || null;
        options.page = req.query.page || null;
        if(req.query.rating){
          /*add code to sort by rating*/
        }
        if(req.query.nearby){
          let maxDistance = req.query.distance || 8;
    			maxDistance /= 6371;
    			queryObj.loc={
    				$near: [req.query.longitude,req.query.latitude],
    				$maxDistance: maxDistance
    			};
    		}
        if(req.query.interest){
          
          queryObj.interest = req.query.interest;
          /*
          var userInterest = [];
          var userInterestQueryObj = [];
          for (let interest in userInterest) {
            let interestObject = {};
            interestObject['interest'] = userInterest[interest];
            userInterestQueryObj.push(interestObject);
          }
          queryObj.$or = userInterestQueryObj;*/
        }
        if(req.query.revealedUsers && req.user){
          options.select = 'status revealedPicture firstName lastName displayName';
          User.findById(req.user).select('revealed').then(function(revealedList){
            queryObj['_id'] = { "$in": revealedList };  
            
            if(req.query.userSearch){
              var userRe = new RegExp(req.query.userSearch.toLowerCase(), "i");
              queryObj.$or = [{ 'firstName': { $regex: userRe }}, { 'lastName': { $regex: userRe }},{ 'displayName': { $regex: userRe }}];
            }
            
            User.paginate(queryObj, options).then(function(userList) {
              res.json(userList);
            });
          });
           
        }
        else{
          options.select = 'anonName status picture';    
          User.paginate(queryObj, options).then(function(userList) {
            res.json(userList);
          });
        }
        //options.populate = req.query.populate || null;
}
function generateUserObj(item){
  var user = new User();

  if(item.firstName){
    user.firstName = item.firstName.toLowerCase();  
  }
  if(item.lastName){
    user.lastName = item.lastName.toLowerCase();  
  }
  if(item.email){
    user.email = item.email;  
  }
  if(item.bannerImage){
    user.bannerImage = item.bannerImage;  
  }
  if(item.userImages){
    user.userImages = item.userImages;  
  }
  if(user.phone){
    user.phone = item.phone;  
  }
  if(user.bio){
    user.bio = item.bio;  
  }
  if(user.status){
    user.status = item.status;  
  }
  if(user.displayName){
    user.displayName = item.displayName;
  }
  if(user.anonName){
    user.anonName = item.anonName;
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
  User.findById(req.params.userId)
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

function updateUser(req, res) {
	
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
    	console.log("hit the empty user");
    	console.log(err);
      
    }
      
      var user = generateUserObj(req.body.user);
      user.save(function(err, result) {
        if (err) {
          console.log(err);
        }
        res.json(result);
      });
    
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
