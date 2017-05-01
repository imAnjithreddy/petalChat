'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BlockSchema = new Schema({
	
	time: { type: Date, default: Date.now },
	user1: { type: Schema.ObjectId, ref: "User"},
	user2: { type: Schema.ObjectId, ref: "User"}
});

var Block = mongoose.model("Block", BlockSchema);


exports.Block = Block;
