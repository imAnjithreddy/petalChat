
var http = require('http');
var io = require('socket.io');
var express = require('express');

var app = express();
var server = http.createServer(app);

io = io.listen(server);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var compression = require('compression');
var cors = require('cors');

mongoose.Promise = global.Promise;

var config = require('./config');
  app.set('dbUrl', config.db[app.settings.env]);
  // connect mongoose to the mongo dbUrl
  mongoose.connect(app.get('dbUrl'));

var port = process.env.PORT || 3000;


app.use(cors());
var cityRouter = require('./routes/city');
var upvoteRouter = require('./routes/upvoteRoute');
var chatRouter = require('./routes/chatRoute');
var chatRoomRouter = require('./routes/chatRoomRoute');
var authenticateRouter = require('./routes/authRoute');
var postRouter = require('./routes/postRoute');
var userRouter = require('./routes/userRoute');
var revealRouter = require('./routes/revealRoute');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(compression());
app.set('port', process.env.PORT || 3000);



app.use('/user',userRouter);
app.use('/upvote',upvoteRouter);
app.use('/reveal',revealRouter);
app.use('/authenticate',authenticateRouter);
app.use('/city',cityRouter);
app.use('/post',postRouter);
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    req.io = io;
    next();
});
app.use('/chat', chatRouter);
app.use('/chatRoom', chatRoomRouter);


io.on('connection', function(socket) {
    
    socket.on('addToChatRoom', function(room) {
      
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
        
    });
    
    
