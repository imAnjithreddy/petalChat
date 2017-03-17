'use strict';

var City = require('..//models/city').City;

var geolib = require('geolib');

var cityController = {
  createCity: createCity,
  getCity: getCity
};


function getCity(req,res){
        var queryObj = {};
        var options = {};
        options.limit = req.query.limit ? parseInt(req.query.limit) : null;
        options.sort = req.query.sort || null;
        options.page = req.query.page || null;
        options.sort = 'distance';
        if(req.query.nearby){
          console.log(req.query.distance);
    			let maxDistance = req.query.distance*100;
    			maxDistance /= 6371;
    			queryObj.loc={
    				$near: [req.query.longitude,req.query.latitude],
    				$maxDistance: maxDistance
    			};
		    }
        City.paginate(queryObj, options).then(function(cityList) {
            res.json(cityList);
        });
        
}
function createCity(req, res) {
  var fs = require('fs');
var obj;
fs.readFile('././city.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
  for (var cit in obj) {
    var city = new City();
    city.loc = [obj[cit].lon,obj[cit].lat]
    city.city = obj[cit].city;
    
        city.distance = geolib.getDistance({latitude:17.362377,longitude:78.523026}, {
            latitude: obj[cit].lat,
            longitude: obj[cit].lon
        })/1000;
    

    city.save(function(error, result) {
      if (error) {
        console.log("error" + error);
      }
      else {
        console.log(result.distance);
      }
    });
    
  }
  //res.json(obj);
});/*
  var city = new City();
  city.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
      res.json(result);
    }
  });*/


}


module.exports = cityController;
