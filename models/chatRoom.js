'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var URLSlugs = require('mongoose-url-slugs');
var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;

//var connectionString = "mongodb://shopdb:shopdb1234@ds029476.mlab.com:29476/shopdb";
//var connectionString  = "mongodb://shop_dir:shop_dir@ds023912.mlab.com:23912/shoppins";

var ChatRoomSchema = new Schema({
	creator1: { type: Schema.ObjectId, ref: "User" },
	creator2: { type: Schema.ObjectId, ref: "User" },
	chats: [{ type: Schema.ObjectId, ref: "Chat" }],
	lastMessage: { type: Schema.ObjectId, ref: "Chat" },
	lastMessageTime: { type: Date },
	revealed: {type:Boolean, default: false}

});
ChatRoomSchema.index({ creator1: 1, creator2: 1 }, { unique: true });
ChatRoomSchema.plugin(mongoosePaginate);
var ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
exports.ChatRoom = ChatRoom;