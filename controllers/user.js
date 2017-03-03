var models = require('..//models/user');
var User = models.User;


var userController = {
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};

function createUser(req, res) {
  var user = new User();

  var item = req.body;
  user.name = item.name.toLowerCase();



  user.bannerImage = item.bannerImage;
  user.userImages = item.userImages;
  user.phone = item.phone;


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
	console.log("the id");
	console.log(req.params);
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
    	console.log("hit the empry iser");
    	console.log(err);
      //next(err, null);
    }
    

      var item = req.body;
      user.firstName = item.firstName.toLowerCase();
      user.lastName = item.lastName.toLowerCase() ;
      user.displayName = item.displayName;
      user.phone = item.phone;
      user.bio = item.bio;
      user.status = item.status;


      // user.bannerImage = item.bannerImage;
      // user.userImages = item.userImages;
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
