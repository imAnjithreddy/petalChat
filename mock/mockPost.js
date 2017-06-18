'use strict';

var Post = require('..//models/post').Post;
var User = require('..//models/user').User;
var INUsers = ['594665854342a8079a06ae4a',
'594665854342a8079a06ae4b',
'594665854342a8079a06ae4d',
'594665854342a8079a06ae4c',
'594665854342a8079a06ae4e',
'594665854342a8079a06ae4f'];
var RUSUsers = ['59468f625ab28d0f5db99172',
'59468f625ab28d0f5db99173',
'59468f625ab28d0f5db99174',
'59468f625ab28d0f5db99175',
'59468f625ab28d0f5db99176',
'59468f625ab28d0f5db99177'];

var RUSLocations = [{
    latitude: 55.748517,
    longitude: 37.607661
},{
    
    latitude: 55.049236, 
    longitude: 82.956026
},{
    latitude: 42.977610,
    longitude:  47.490377
},
    {
    latitude: 48.526188,
    longitude:  135.162857
},{
    latitude: 53.294247, 
    longitude:  50.250230
},{
    latitude: 53.370455, 
    longitude:  83.723533
   
}
];   

function generatePostObj(user,item,location){
  var post = new Post();

  
    post.content = item.text;  
    post.user = user;  
    post.loc = [location.longitude,location.latitude];  
    post.image = item.thread.main_image;
    post.postUrl = item.thread.url;
    
    var interests = [];
    var titleInterests = item.title.split(" ");
    for (var i = 0; i < titleInterests.length; i++) {
        var titleText = titleInterests[i];
        if(titleText.length>5){
            interests.push(titleText);
        }
    }
    
    post.interests = interests.slice(0,4);
    console.log(post.interests);
  
  return post;


  
}
function createPost(payload) {
  
  
  
  var randomNumber = Math.floor(Math.random() * 6);  
  var randomNumber2 = Math.floor(Math.random() * 6);  
  var user = RUSUsers[randomNumber];
  var location = RUSLocations[randomNumber2];
  
  
  var post = generatePostObj(user,payload,location);
  
  post.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
      console.log("post has been created");
    }
  });
}
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
  
  mongoose.connect('').then(function(){
      console.log("entered connection");
        let fs = require('fs');
        fs.readFile('./mockIN2.json', 'utf8', function (err,data) {
            
          if (err) {
             console.log(err);
          }
          
          
          
          console.log(typeof data);
          data = JSON.parse(data);
          let posts = data.posts;
          for(var i=0;i<posts.length;i++){
             
                createPost(posts[i]);  
             
              
          }
          //console.log(data);
        });
  }).catch(function(err){
      console.log("err connection");
      console.log(err);
  });



