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
var numUsers = 0;

//주소창에 접속하면
io.on('connection', (socket) => {
  var addedUser = false;
  console.log(socket.id);
  //Client로부터 “new message”라는 이벤트 수신할 시, data 파라미터와 함께 Callback을 받습니다.
  socket.on('new message', (data) => {
    socket.broadcast.emit('new message', {
      username:socket.username,
      message:data
    });
  });

  //유저 추가됬다고 받음
  socket.on('add user', (username) => {
      if (addedUser) return;

      //we store the username in the socket session for this client
      socket.username = username;
      console.log(socket.username);
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
          numUsers: numUsers
      });

      //나빼고 모든 사람에게
      socket.broadcast.emit('user joined', {
          username: socket.username,
          numUsers: numUsers
      });

      //타이핑하는 사람 보내기
      socket.on('typing', () => {
          socket.broadcast.emit('typing', {
              username:socket.username
          });
      });
  });




  socket.on('disconnect', () => {
      if(addedUser) {
          --numUsers;
          console.log(socket.username);
          socket.broadcast.emit('user left',{
              username: socket.username,
              numUsers: numUsers
          });
      }
  })
});


