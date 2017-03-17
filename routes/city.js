'use strict';
var express = require('express');

var CityController = require('../controllers/city');
var cityRouter = express.Router();




//cityRouter.route('/updateCity/:city_id').city(commons.ensureAuthenticated, cityController.updateCity);
cityRouter.route('/create').get(CityController.createCity);

cityRouter.route('/get').get(CityController.getCity);
module.exports = cityRouter;

