window.onload = function(){
  var FADE_TIME = 150;
  var TYPING_TIMER_LENGTH = 400;
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ]

  // Initialize variables
  var windowObj = window;
  var usernameInput = document.querySelector('.usernameInput');
  var messages = document.querySelector('.messages');
  var inputMessage = document.querySelector('.inputMessage');

  var loginPage = document.querySelector('.login.page');
  var chatPage = document.querySelector('.chat.page');

  //Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var currentInput = usernameInput.focus();

  var socket = io();

  const addParticipantsMessage = (data) => {
    var message = '';
    if(data.numUser === 1 ) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    console.log(message);
  }

  //로그인
  socket.on('login', (data) => {
    connected = true;
    var message = "Welcome to Socket.IO Chat - ";
    log(message, {
      prepend: true
    });
    console.log('data',data);
    addParticipantsMessage(data);
  });

  window.onkeydown = (keycode) => {

    if(keycode.key == 'Enter'){
      if(username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  }

  const sendMessage = () => {
    //메세지 값
    var message = inputMessage.value;
    //Prevent markup from being injected into the message

    //if there is a non-empty message and a socket connetion
    if(message && connected){
      inputMessage.value = '';
      addChatMessage({
        username: username,
        message: message
      });

      //tell server to excute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  const cleanInput = (input) => {
    // return `<div>${input}</div>`
    return $('<div/>').text(input).html();
  };

  const setUsername = () => {

    //공백같은거 제거해야함
    username = usernameInput.value.trim();

    if(username) {
      loginPage.classList.add('hide');
      loginPage.classList.remove('show');
      chatPage.style.display = 'block';
      // loginPage.removeEventListener('click', currentInput,false);
      currentInput = inputMessage.focus();
      // inputMessage.style.display = 'block';
      // currentInput = inputMessage.focus();
    }

    //Tell the server your username
    socket.emit('add user', username);

  }

  //Adds the visual chat message to the message list
  const addChatMessage = (data, options) => {
    //Don't fade the message in if there is an 'X was typing'
    console.log('addChatMessage',data);
  }

  loginPage.onclick = () => {
    inputMessage.focus();
  }

  inputMessage.onclick = () => {
    inputMessage.focus();
  }
  //
  // usernameInput.keydown(event => {
  //   console.log('keydown', event);
  //Auto-focus the current input when a key is typed
  // if(!(event.ctrlKey || event.metaKey || event.altKey)){
  //   currentInput.focus();
  // }
  // //When the client hits ENTER on theirkeyboard
  // if(event.which === 13) {
  //   if(username) {
  //
  //   }
  // }

  // })

  socket.on('new message', (data) => {
      addChatMessage(data);
  });

  socket.on('ksh', (data) => {
    console.log(data);
    // addChatMessage(data);
  });
};
