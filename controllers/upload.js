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
  getImages: getImages
};

function deleteUpload(req,res){
  var public_id = req.body.data.public_id;
  
  cloudinary.uploader.destroy(public_id,function(err,result){
    
    console.log("deleted");
    console.log(public_id);
    console.log(result);
    res.json(result);
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
    client.search().images(10).withPhrase(req.query.imageText||'happy')
        .execute(function(err, response) {
            if(err){
                console.log(err);
            }
           // console.log(Object.keys(response.images[0]));
            //console.log(JSON.stringify(response.images));
            var images = response.images;
            var imageURL =[]; 
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
   
 }

module.exports = uploadController;
