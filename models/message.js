'use strict';
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	type: String,
	message: String,
	messageRoom: { type: Schema.ObjectId, ref: "MessageRoom", childPath: "messages" },
	time: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: "User" }
});
MessageSchema.plugin(relationship, { relationshipPathName: 'messageRoom' });
MessageSchema.plugin(mongoosePaginate);
var Message = mongoose.model("Message", MessageSchema);


exports.Message = Message;
