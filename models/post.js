'use strict';
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var relationship = require("mongoose-relationship"); //Refer https://www.npmjs.com/package/mongoose-relationship
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
var PostSchema = new Schema({
	content: String,
	time: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: "User", childPath: "posts"},
	postUrl: {type:String},
	image: {type:String},
	imageId: {type:String},
	interests: [String],
	loc: {
    		type: [Number],  // [<longitude>, <latitude>]
    		index: '2d'      // create the geospatial index
    	},
    upvotes: [{ type: Schema.ObjectId, ref: "Upvote"}],
    comments: [{ type: Schema.ObjectId, ref: "Comment"}],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    upvotesLength: { type: Number, default: 0 },
    likesLength: { type: Number, default: 0 },
    views: {type: Number, default: 0}
});

PostSchema.plugin(relationship, { relationshipPathName: 'user' });
PostSchema.plugin(autoIncrement.plugin, { model: 'Post', field: 'postAutoId' });
PostSchema.plugin(mongoosePaginate);
var Post = mongoose.model("Post", PostSchema);


exports.Post = Post;
