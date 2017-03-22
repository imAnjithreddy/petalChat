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
        options.select = 'anonName status picture loc';    
        
        
        if(req.query.revealed){
          options.select = 'status revealedPicture firstName lastName displayName loc';
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
        else if(req.query.received ){
          User.findById(req.user).select('received').then(function(revealedList){
            queryObj['_id'] = { "$in": revealedList };  
            User.paginate(queryObj, options).then(function(userList) {
              res.json(userList);
            });
          });
          
        }
        else if(req.query.requested){
          User.findById(req.user).select('requested').then(function(revealedList){
            queryObj['_id'] = { "$in": revealedList };  
            User.paginate(queryObj, options).then(function(userList) {
              res.json(userList);
            });
          });
          
        }
        else if(req.query.all){
            if(req.query.interest){
          
             var userRe = new RegExp(req.query.interest.toLowerCase(), "i");
              queryObj.interest =userRe;
            
            }
            User.paginate(queryObj, options).then(function(userList) {
              return res.json(userList);
            });
        }
        else if(req.query.nearby){
    			let maxDistance = req.query.distance*100;
    			maxDistance /= 6371;
    			queryObj.loc={
    				$near: [req.query.longitude,req.query.latitude],
    				$maxDistance: maxDistance
    			};
    			User.paginate(queryObj, options).then(function(userList) {
              res.json(userList);
          });
		    }
        //options.populate = req.query.populate || null;
}

function generateUserObj(item,existingUser){
  
    var user = existingUser || new User();  
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
  if(item.phone){
    user.phone = item.phone;  
  }
  if(item.bio){
    user.bio = item.bio;  
  }
  if(item.status){
    user.status = item.status;  
  }
  if(item.displayName){
    user.displayName = item.displayName;
  }
  if(item.anonName){
    user.anonName = item.anonName;
  }
  if(item.latitude && item.longitude){
    console.log("the latitude and longitude");
    console.log(item.latitude+"::"+item.longitude);
    user.loc = [item.longitude,item.latitude];  
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
  console.log("get user");
  console.log(req.user);
  if(req.user == req.params.id){
    revealedUser(req.user,res);
  }
  else{
    User.findById(req.user)
    .then(function(result) {
        if(result.revealed.indexOf(req.params.id)!=-1){
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
      console.log("the requested object");
      console.log(req.body.user);
      var user = generateUserObj(req.body.user,foundUser);
      
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






  /*
              var userInterest = [];
              var userInterestQueryObj = [];
              for (let interest in userInterest) {
                let interestObject = {};
                interestObject['interest'] = userInterest[interest];
                userInterestQueryObj.push(interestObject);
              }
              queryObj.$or = userInterestQueryObj;*/
