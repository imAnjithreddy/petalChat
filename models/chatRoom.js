'use strict';
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var ChatRoomSchema = new Schema({
	creator1: { type: Schema.ObjectId, ref: "User" },
	creator2: { type: Schema.ObjectId, ref: "User" },
	chats: [{ type: Schema.ObjectId, ref: "Chat" }],
	lastMessage: { type: Schema.ObjectId, ref: "Chat" },
	lastMessageTime: { type: Date },
	lastLoggedOut: { type: Date },
	revealed: {type:Boolean, default: false}

});
ChatRoomSchema.index({ creator1: 1, creator2: 1 }, { unique: true });
ChatRoomSchema.plugin(mongoosePaginate);
var ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
exports.ChatRoom = ChatRoom;