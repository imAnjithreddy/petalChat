'use strict';
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
var ChatSchema = new Schema({
	type: String,
	message: String,
	chatRoom: { type: Schema.ObjectId, ref: "ChatRoom", childPath: "chats" },
	time: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: "User" }
});
ChatSchema.plugin(autoIncrement.plugin, { model: 'Chat', field: 'chatAutoId' });
ChatSchema.plugin(relationship, { relationshipPathName: 'chatRoom' });
ChatSchema.plugin(mongoosePaginate);
var Chat = mongoose.model("Chat", ChatSchema);


exports.Chat = Chat;
