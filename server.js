//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var socketio = require('socket.io');
var express = require('express');

var app = express();
var server = http.createServer(app);

var io = socketio.listen(server);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var compression = require('compression');
var cors = require('cors');

//Variables
var port = process.env.PORT || 3000;


app.use(cors());


//moment added to be used in jade

//app.locals.moment = require('moment');
//Imports from custom made js

var authenticateRouter = require('./routes/authenticateRoute');
var chatRouter = require('./routes/chatRoute');
var urlStrings = require('./routes/url');
var uploadRouter = require('./routes/uploadRoute');
var userRouter = require('./routes/userRoute');

//Middleware from built-in methods
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(compression());
app.set('port', process.env.PORT || 3000);


app.use('/authenticate',authenticateRouter);
app.use('/upload',uploadRouter);
app.use('/user',userRouter);
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    req.io = io;
    next();
});
app.use('/chat', chatRouter);
app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
mongoose.Promise = global.Promise;
mongoose.connect(urlStrings.connectionString);//"mongodb://shop_dir:shop_dir@ds023912.mlab.com:23912/shoppins");
//mongoose.connect("mongodb://shopdb:shopdb1234@ds029476.mlab.com:29476/shopdb");

io.on('connection', function(socket) {
    
    socket.on('addToRoom', function(room) {
      
        socket.join(room.roomId);
    });
    socket.on('addToSingleRoom', function(singleRoom) {
      
        socket.join(singleRoom.roomId);
    });
    socket.on('removeFromRoom', function(room) {
        socket.leave(room.roomId);
    });
    socket.on('disconnect', function() {
        
    });
});
server.listen(app.get('port'), function() {
        console.log("Listening");
        console.log(__dirname);
    })
