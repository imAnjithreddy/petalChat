var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('../config');
module.exports = function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(140, 'days').unix()
  };
  return jwt.encode(payload,  config.secret.token);
};


function createAndReturnToken(user,req,res){
	var payload = {
		iss: req.hostname,
		sub:user.id
	}
	var token = jwt.encode(payload,"shhh..");
	return res.status(200).send({user:user.toJSON(),token:token});
}