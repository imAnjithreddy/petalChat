'use strict';
var defaults = {
    // define the name for your Users model.
    personModelName:            'User',
    // define the name for the Friendship model
    friendshipModelName:        'Friendship',
    // define the name of the Friendship collection.
    friendshipCollectionName:   undefined
}
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var URLSlugs = require('mongoose-url-slugs');
var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var FriendsOfFriends = require('friends-of-friends')(mongoose,defaults);
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	'device_token': String,
	"firstName": String,
	"lastName": String,
	"status": String,
	"gender": { type: String, enum: ['Male', 'Female','Other'] },
	"interests": [String],
	"postInterests": [String],
	"password": String,
	"facebook": String,
	"google": String,
	'googleName': String,
	'googlePicture': String,
	'facebookName': String,
	'facebookPicture': String,
	"picture": { type: String, default: 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538303-user_512x512.png' },
	"displayName": String,
	"revealedPicture": String,
	"anonName": {type:String,default:'anonUser'},
	"loc": {
    	type: [Number],  // [<longitude>, <latitude>]
    	index: '2d'      // create the geospatial index
    },
    "upvotes": [{ type: Schema.ObjectId, ref: "Upvote"}],
	"requested": [{ type: Schema.ObjectId, ref: "User" }],
	"received": [{ type: Schema.ObjectId, ref: "User" }],
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
UserSchema.plugin(FriendsOfFriends.plugin,defaults);
try{
	exports.User = mongoose.model('User', UserSchema);
}
catch(err){
	console.log("err");
}

