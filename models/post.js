'use strict';
var mongoose = require('mongoose');

var URLSlugs = require('mongoose-url-slugs');
var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	content: String,
	time: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: "User", childPath: "posts"},
	interests: [String],
	loc: {
    		type: [Number],  // [<longitude>, <latitude>]
    		index: '2d'      // create the geospatial index
    	}
});

PostSchema.plugin(relationship, { relationshipPathName: 'user' });
PostSchema.plugin(mongoosePaginate);
var Post = mongoose.model("Post", PostSchema);


exports.Post = Post;
