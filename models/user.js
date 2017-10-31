'use strict';
var mongoose = require('mongoose');

var mongoosePaginate = require('mongoose-paginate');
//profile: { device: '915cc30e4c98ec35'
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	'device_token': String,
	'login_device_token': String,
	"unique_id": {
        type:String,
        unique: true
    },
	"status": String,
	"gender": { type: String, enum: ['Male', 'Female','Other'] },
	"interests": [String],
	"postInterests": [String],
	"password": String,
	"picture": { type: String, default: 'https://cdn3.iconfinder.com/data/icons/black-easy/512/538303-user_512x512.png' },
	"anonName": {type:String,default:'anonUser'},
	"loc": {
    	type: [Number],  // [<longitude>, <latitude>]
    	index: '2d'      // create the geospatial inde
    },
    "age": {
    	type: Number,
    	default: 18
    },
    "upvotes": [{ type: Schema.ObjectId, ref: "Upvote"}],
    "comments": [{ type: Schema.ObjectId, ref: "Comment"}],
	"posts": [{ type: Schema.ObjectId, ref: "Post" }],
	"likes": [{ type: Schema.ObjectId, ref: "Post" }],
	"city": {type:String},
	"following": [{ type: Schema.Types.ObjectId, ref: "User" }],
	"followers": [{ type: Schema.Types.ObjectId, ref: "User" }]
	
}, { collection: 'users' });
UserSchema.methods.toJSON = function() {
	var user = this.toObject();
	delete user.password;
	return user;

};

UserSchema.plugin(mongoosePaginate);

UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'userAutoId' });

try{
	exports.User = mongoose.model('User', UserSchema);
}
catch(err){
	console.log("err");
}

