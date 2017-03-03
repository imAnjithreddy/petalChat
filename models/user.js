'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var URLSlugs = require('mongoose-url-slugs');
var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;
var urlStrings = require('../routes/url.js');
var UserSchema = new Schema({
	"firstName": String,
	"lastName": String,
	"status": String,
	"bio": String,
	'verified': Boolean,
	'email': { type: String, unique: true },
	"password": String,
	"facebook": String,
	"picture": { type: String, default: 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538303-user_512x512.png' },
	"displayName": String,
	"anonName": String,
	"description": String,
	"revealRequested": [{ type: Schema.ObjectId, ref: "User" }],
	"revealReceived": [{ type: Schema.ObjectId, ref: "User" }],
	"revealed":[{ type: Schema.ObjectId, ref: "User" }]

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
var User = mongoose.model('User', UserSchema);
UserSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});


exports.User = User;
