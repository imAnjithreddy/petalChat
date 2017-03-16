'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var URLSlugs = require('mongoose-url-slugs');
var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
	type: String,
	message: String,
	chatRoom: { type: Schema.ObjectId, ref: "ChatRoom", childPath: "chats" },
	time: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: "User" }
});
ChatSchema.plugin(relationship, { relationshipPathName: 'chatRoom' });
ChatSchema.plugin(mongoosePaginate);
var Chat = mongoose.model("Chat", ChatSchema);


exports.Chat = Chat;
