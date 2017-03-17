'use strict';
var mongoose = require('mongoose');


var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var CitySchema = new Schema({
	city: String,
	distance: Number,
	loc: {
    		type: [Number],  // [<longitude>, <latitude>]
    		index: '2d'      // create the geospatial index
    	}
});

CitySchema.plugin(mongoosePaginate);
var City = mongoose.model("City", CitySchema);


exports.City = City;
