'use strict';



var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'shoppingdirectory',
    api_key: '967339527283183',
    api_secret: '74NXckYl9m1-O0_ZTU8U_qoIDfw'
});

var uploadController = {
  singleUpload: singleUpload,
  multipleUpload: multipleUpload,
  deleteUpload: deleteUpload,
  singleUploadId: singleUploadId,
  getImages: getImages,
  uploadBASE64: uploadBASE64
};

function deleteUpload(req,res){
  var public_id = req.body.data.public_id;
  
  cloudinary.uploader.destroy(public_id,function(err,result){
    if(err){
      console.log("error in delete");
      console.log(err);
    }
    console.log("deleted");
    console.log(public_id);
    console.log(result);
    res.json(result);
  });
}
function uploadBASE64(req,res){
  
  cloudinary.uploader.upload("data:image/png;base64,"+req.body.imageString,function(reqc,resc){
    var imgUrl = resc.url;
    var  public_id = resc.public_id;
    res.json({image:imgUrl,imageId:public_id});
  });
}


function singleUploadId(req, res){
  var file = req.file;    
  
  cloudinary.uploader.upload(file.path,function(reqc, resc) {
    var imgUrl = resc.url;
    var  public_id = resc. public_id;
    console.log("inside upload");
    res.json({image:imgUrl,imageId:public_id});
  });
} 
function singleUpload(req, res){
  var file = req.file;    
  console.log("image upload");
  cloudinary.uploader.upload(file.path,{ eager: [
    {effect: "grayscale"}
         ]},function(reqc, resc) {
    var imgUrl = resc.url;
    
    res.send(imgUrl);
  });
}

function multipleUpload(req, res){
  var imgArray = [];
  var imgArrayMin = [];
  var size = req.files.length;
  var counter = 0;
  
  for(let i=0; i<size;i++){
    cloudinary.uploader.upload(req.files[i].path, { eager: [{ width: 112, height: 112, crop: "pad" }
             ]},function(reqc, resc) {
                imgArray.push(resc.url);
                imgArrayMin.push(resc.eager[0].url);
                counter = counter + 1;
                if(counter == size){
                res.json(imgArray);
              }
            });
  }
 }
 function callAPI(client,res){
   client.search().images(10).withPhrase("enjoy")
        .execute(function(err, response) {
            if(err){
                console.log(err);
            }
            
            var images = response.images;
            var imageURL =[]; 
            for(var i=0; i<images.length;i++){
                //console.log(images[i].display_sizes);
                for (var j = 0; j < images[i].display_sizes.length; j++) {
                     imageURL.push(images[i].display_sizes[j].uri);
                }
            }
            return res.json(imageURL);
        });
 }
 function getImages(req,res){
    var api = require("gettyimages-api");
    var creds = { apiKey: "jr566bffbcrcs2egf85axr4u", apiSecret: "yDN3mArxDMEa3JUBrgSwxrJPPa6nYspKBdx5ByGSJEfux", username: "imAnjithreddy", password: "Anudeep_909" };
    var client = new api (creds);
    console.log("hit here");
    console.log(req.query);
    var imageURL =[]; 
    var randomImages = ['https://www.newton.ac.uk/files/covers/968361.jpg','https://1.bp.blogspot.com/_IY7CmWJmPL4/R8K5bFaKXpI/AAAAAAAABO0/fH7E6kPibuM/S1600-R/random.jpg','http://cdn.playbuzz.com/cdn/feafe379-c083-4bd5-ab56-b803834fbb01/099c879d-4909-49ad-a941-73a57ff1dc35.jpg','https://i.redd.it/5uyrc8opy9uy.jpg'];
    var stocksnap = require('stocksnap.io');
    stocksnap(req.query.imageText, {highres: false, sort: 'downloads', shuffle: true, pages: 2}, function (snaps) {
      console.log('Oddly specific apple query', snaps);
      if(snaps.length){
        //return res.json(snaps); 
        snaps = snaps.filter(function(snap){
          if(snap.indexOf('http')!=-1){
            return true;
          }
          else{
            return false;
          }
        });
        imageURL = imageURL.concat(snaps);
      }
        client.search().images(10).withPhrase(req.query.imageText||'happy').withResponseField('display_set')
        .execute(function(err, response) {
            if(err){
              console.log("error found getty");
                console.log(err);
            }
           // console.log(Object.keys(response.images[0]));
            //console.log(JSON.stringify(response.images));
            var images = response.images||randomImages;
            
            for(var i=0; i<images.length;i++){
                //console.log(images[i].display_sizes);
                for (var j = 0; j < images[i].display_sizes.length; j++) {
                     imageURL.push(images[i].display_sizes[j].uri);
                }
            }
            if(imageURL.length){
              return res.json(imageURL);  
            }
            else{
              callAPI(client,res);
            }
            
        });
      
    });
    
   
 }

module.exports = uploadController;


