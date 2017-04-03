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
	image: {type:String},
	imageId: {type:String},
	interests: [String],
	loc: {
    		type: [Number],  // [<longitude>, <latitude>]
    		index: '2d'      // create the geospatial index
    	},
    upvotes: [{ type: Schema.ObjectId, ref: "Upvote"}],
    upvotesLength: { type: Number, default: 0 },
    views: {type: Number, default: 0}
});

PostSchema.plugin(relationship, { relationshipPathName: 'user' });
PostSchema.plugin(mongoosePaginate);
var Post = mongoose.model("Post", PostSchema);


exports.Post = Post;
