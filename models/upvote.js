'use strict';
var mongoose = require('mongoose');



var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;

var UpvoteSchema = new Schema({
	
	time: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: "User", childPath: "upvotes"},
	post: { type: Schema.ObjectId, ref: "Post", childPath: "upvotes"},
});

UpvoteSchema.plugin(relationship, { relationshipPathName: 'user' });
UpvoteSchema.plugin(relationship, { relationshipPathName: 'post' });

var Upvote = mongoose.model("Upvote", UpvoteSchema);
exports.Upvote = Upvote;
