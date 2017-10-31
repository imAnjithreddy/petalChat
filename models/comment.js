'use strict';
var mongoose = require('mongoose');


var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
var CommentSchema = new Schema({
	time: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: "User", childPath: "comments"},
	post: { type: Schema.ObjectId, ref: "Post", childPath: "comments"},
	content: {type: String}
});

CommentSchema.plugin(relationship, { relationshipPathName: 'user' });
CommentSchema.plugin(relationship, { relationshipPathName: 'post' });
CommentSchema.plugin(autoIncrement.plugin, { model: 'Comment', field: 'commentAutoId' });
CommentSchema.plugin(mongoosePaginate);
var Comment = mongoose.model("Comment", CommentSchema);
exports.Comment = Comment;
