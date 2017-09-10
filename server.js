
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io');//(server, {pingTimeout: 60000});

io = io.listen(server);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var compression = require('compression');
var cors = require('cors');

mongoose.Promise = global.Promise;

var config = require('./config');
require('dotenv').config();

    app.set('dbUrl', process.env.DB_URL);
    
  //app.set('dbUrl', config.db[app.settings.env]);
  // connect mongoose to the mongo dbUrl

  mongoose.connect(app.get('dbUrl'),{
      useMongoClient: true
  });


app.use(cors());
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}
var upvoteRouter = require('./routes/upvoteRoute');
var chatRouter = require('./routes/chatRoute');
var messageRouter = require('./routes/messageRoute');
var chatRoomRouter = require('./routes/chatRoomRoute');
var messageRoomRouter = require('./routes/messageRoomRoute');
var authenticateRouter = require('./routes/authRoute');
var postRouter = require('./routes/postRoute');
var userRouter = require('./routes/userRoute');
var blockRouter = require('./routes/blockRoute');
var uploadRouter = require('./routes/uploadRoute');
var nativeAuthRouter = require('./routes/nativeAuth');
var revealRouter = require('./routes/revealRoute');
var notificationRouter = require('./routes/notificationRoute');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(compression());
app.set('port', process.env.PORT || 3000);



app.use('/user',userRouter);
app.use('/block',blockRouter);
app.use('/upvote',upvoteRouter);
app.use('/reveal',revealRouter);
app.use('/authenticate',authenticateRouter);
app.use('/upload',uploadRouter);
app.use('/post',postRouter);
app.use('/nativeAuth',nativeAuthRouter);
app.use('/notification',notificationRouter);
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    req.io = io;
    next();
});
app.use('/chat', chatRouter);

app.use('/chatRoom', chatRoomRouter);
app.use('/message', messageRouter);
app.use('/messageRoom', messageRoomRouter);
app.get('*', function (req, res) {
        res.sendFile(__dirname + '/client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

io.on('connection', function(socket) {
    
    socket.on('addToChatRoom', function(room) {
      console.log("joined the room singleroom");
        console.log(room);
        socket.join(room.roomId);
    });
    socket.on('addToSingleRoom', function(singleRoom) {
        console.log("joined the room singleroom");
        socket.join(singleRoom.roomId);
    });
    socket.on('addToMessagetRoom',function(messageRoom){
        console.log("joined the message room");
        console.log(messageRoom);
        socket.join(messageRoom.roomId);
    });
    socket.on('removeFromRoom', function(room) {
        console.log("left room");
        console.log(room.roomId);
        socket.leave(room.roomId);
    });
    socket.on('disconnect', function() {
        console.log("disconnected");
    });
});

server.listen(app.get('port'), function() {
        console.log("listeing on server");
    });
    
    
