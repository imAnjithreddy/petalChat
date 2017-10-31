'use strict';
var mongoose = require('mongoose');



var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	
	time: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: "User", childPath: "comments"},
	post: { type: Schema.ObjectId, ref: "Post", childPath: "comments"},
	content: {type: String}
});

CommentSchema.plugin(relationship, { relationshipPathName: 'user' });
CommentSchema.plugin(relationship, { relationshipPathName: 'post' });

var Comment = mongoose.model("Comment", CommentSchema);
exports.Comment = Comment;
