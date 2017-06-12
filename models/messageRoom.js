'use strict';
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var MessageRoomSchema = new Schema({
	interest: {type: String},
	post: {type:Schema.ObjectId,ref:'Post'},
	messages: [{ type: Schema.ObjectId, ref: "Message" }],
	lastMessage: { type: Schema.ObjectId, ref: "Message" },
	lastMessageTime: { type: Date },
	users: [{type: Schema.ObjectId, ref:"User"}]

});

MessageRoomSchema.plugin(mongoosePaginate);
var MessageRoom = mongoose.model("MessageRoom", MessageRoomSchema);
exports.MessageRoom = MessageRoom;