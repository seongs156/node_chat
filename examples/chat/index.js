//Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

//Routing
app.use(express.static(path.join(__dirname, 'public')));

//chatRoom
var numUser = 0;

//주소창에 접속하면
io.on('connection', (socket) => {
  var addUser = false;
  console.log(socket.id);
  //Client로부터 “new message”라는 이벤트 수신할 시, data 파라미터와 함께 Callback을 받습니다.
  socket.on('new message', (data) => {
    socket.broadcast.emit('new message', {
      username:socket.username,
      message:data
    });
  });
  //when the client emits 'new message', this listens and excutes

});
