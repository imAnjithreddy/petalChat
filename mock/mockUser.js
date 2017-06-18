'use strict';
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

    
    
  //app.set('dbUrl', config.db[app.settings.env]);
  // connect mongoose to the mongo dbUrl

  mongoose.connect('').then(function(){
   var RUArray = [{
    latitude: 55.748517,
    longitude: 37.607661,
    city: 'MOS',
    anonName: 'Yellow Menace',
    picture: 'https://cdn1.iconfinder.com/data/icons/character-2/240/19-512.png',
    interests: ['amazing','life']
},{
    
    latitude: 55.049236, 
    longitude: 82.956026,
    city: 'NOVO',
    anonName : 'WarlockOPain',
    picture: 'https://image.shutterstock.com/z/stock-vector-woman-profile-cartoon-graphic-design-vector-illustration-eps-352567484.jpg',
    interests: ['food','happy']
},{
    latitude: 42.977610,
    longitude:  47.490377,
    city: 'MAKH',
    anonName : 'br0ken smile',
    picture: 'http://3.bp.blogspot.com/-fvQG2F0a8qg/UCEFyRnOg-I/AAAAAAAAD-I/Lp4J4v3Ijv0/s1600/profile.jpg',
    interests: ['smile','fun','pretty']
},
    {
    latitude: 48.526188,
    longitude:  135.162857,
    city: 'KHAB',
    anonName: 'NetFreak',
    picture: 'http://img04.deviantart.net/eb37/i/2012/050/d/5/dreamer9242_by_dreamer9242-d4qbwif.png',
    interests: ['break-up','summer']
},{
    latitude: 53.294247, 
    longitude:  50.250230,
    city: 'SAM',
    anonName : 'Melody',
    picture: 'http://www.mosta2bal.com/vb/badeencache/3/19023station.jpeg',
    interests: ['sun','friends']
},{
    latitude: 53.370455, 
    longitude:  83.723533,
    city: 'BARN',
    anonName : 'Criss Cross',
    picture: 'http://p2.i.ntere.st/7aa60f5839fa93f9084a3b49bc760e7a_480.jpg',
    interests: ['like','fashion']
}
];   
for (var i =0;i< RUArray.length; i++ ) {
    createUser(RUArray[i]);
}
  });

var User = require('..//models/user').User;

var INArray = [{
    latitude: 17.385190,
    longitude: 78.476420,
    city: 'HYD',
    anonName: 'Shy Doll',
    picture: 'https://s-media-cache-ak0.pinimg.com/736x/9c/5e/86/9c5e86be6bf91c9dea7bac0ab473baa4.jpg',
    interests: ['no-rules','life']
},{
    latitude: 13.127445, 
    longitude: 80.202303,
    city: 'CHENNAI',
    anonName : 'Strange Evil',
    picture: 'https://cdn.pixabay.com/photo/2014/04/03/10/53/girl-311628_960_720.png',
    interests: ['dance','happy']
},{
    latitude: 12.974801, 
    longitude: 77.591074,
    city: 'BNG',
    anonName : 'Teen Touch',
    picture: 'https://i.ytimg.com/vi/XomyjYskPIc/maxresdefault.jpg',
    interests: ['lost','fun']
},
    {
    latitude: 19.117126,
    longitude:  72.848190,
    city: 'MUM',
    anonName: 'Lovely Poison',
    picture: 'http://hotphotosfree.com/sites/default/files/styles/large/public/field/image/60ab7a99fbe8df228175f341efc268ab.jpg?itok=Q5SQOvCx',
    interests: ['break-up','hit']
},{
    latitude: 28.627899,
    longitude:  77.196092,
    city: 'DEL',
    anonName : 'Internet Princess',
    picture: 'http://webneel.com/daily/sites/default/files/images/daily/05-2014/23-manga-girls.jpg',
    interests: ['songs','disco']
},{
    latitude: 25.601416,
    longitude:  91.883199,
    city: 'SHIL',
    anonName : 'Fairy Fresh',
    picture: 'https://s9.favim.com/610/131019/blossom-cartoon-network-clothes-cute-Favim.com-1004475.jpg',
    interests: ['chat','fashion','run']
}
];


function generateUserObj(item){
  
  var user =  new User();  
    user.city = 'IN';
    user.picture = item.picture;  
  
    user.gender = 'Female';  
  
    user.anonName = item.anonName;
  
  
    user.loc = [item.longitude,item.latitude];  
  
  
    user.interests = item.interests;
    return user;


  
}
function createUser(payload) {
  
  var user = generateUserObj(payload);
  console.log(user);
  user.save(function(error, result) {
    if (error) {
      console.log("error" + error);
    }
    else {
     console.log(result._id);
    }
  });


}
