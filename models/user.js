'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var URLSlugs = require('mongoose-url-slugs');
var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	"firstName": String,
	"lastName": String,
	"status": String,
	"bio": String,
	"interest": [String],
	'verified': Boolean,
	'email': { type: String, unique: true },
	"password": String,
	"facebook": String,
	"picture": { type: String, default: 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538303-user_512x512.png' },
	"displayName": String,
	"revealedPicture": String,
	"anonName": String,
	"description": String,
	"loc": {
    	type: [Number],  // [<longitude>, <latitude>]
    	index: '2d'      // create the geospatial index
    },
	"revealRequested": [{ type: Schema.ObjectId, ref: "User" }],
	"revealReceived": [{ type: Schema.ObjectId, ref: "User" }],
	"revealed":[{ type: Schema.ObjectId, ref: "User" }],
	"posts": [{ type: Schema.ObjectId, ref: "Post" }]

}, { collection: 'users' });
UserSchema.methods.toJSON = function() {
	var user = this.toObject();
	delete user.password;
	return user;

};

UserSchema.methods.comparePasswords = function(password, callback) {
	bcrypt.compare(password, this.password, callback);

};
UserSchema.plugin(mongoosePaginate);

UserSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});
try{
	exports.User = mongoose.model('User', UserSchema);
}
catch(err){
	console.log("err");
}

