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
    log(message);
  }

  //로그인
  socket.on('login', (data) => {
    connected = true;
    var message = "socket IO 채팅에 오셨네엽!";
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
        typing = false;
      } else {
        console.log('Enter else');
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

      //Tell the server your username
      socket.emit('add user', username);
    }
  }
  //타이핑 메시지 얻기
  const getTypingMessages = (data) => {
    // console.log('겟타이핑메세지',data);
    // console.log(document.querySelector('.typing.message'));
    // Array.prototpy


  }
  const getUsernameColor = (username) => {
    var hash = 7;
    for(var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }

    //calculate color
    var index = Math.abs(hash % COLORS.length);
    console.log('색깔은?',COLORS[index]);
    return COLORS[index];
  }

  //Adds the visual chat message to the message list
  const addChatMessage = (data, options) => {

    // console.log('탸핑', typingMessages);
    var hoho = [data];
    var typingMessages = document.createElement('div');

    hoho.filter( jayeon => {
      typingMessages.classList.add('typing');
      typingMessages.classList.add('message');
      typingMessages.innerText = jayeon.username;
    });
    console.log('탸핑길이',typingMessages);
    options = options || {};

      if(document.querySelector('.typing')){
        options.fade = false;
        document.querySelector('.typing').remove();
      }



    var usernameDiv = document.createElement('span');
    usernameDiv.classList.add('username');
    usernameDiv.style.color = getUsernameColor(data.username);
    usernameDiv.innerText = data.username+' : ';
    var messageBodyDiv = document.createElement('span');
    messageBodyDiv.classList.add('messageBody');
    messageBodyDiv.innerText = data.message;

    // var typingClass = data.typing ? 'typing' : '';
    // console.log('typingClass',typingClass);
    var messageDiv = document.createElement('li');
    // messageDiv.classList.add('message');
    // messageDiv.innerText = data.username;
    // messageBodyDiv.classList.add(typingClass);
    // messageBodyDiv.classList.add(typingClass);
    // document.querySelector('.typing').classList.add('hide');
    messageDiv.append(usernameDiv, messageBodyDiv);


    addMessageElement(messageDiv, options);

  }

  //로그메시지
  const log = (message, options) => {
    var el = document.createElement('li');
    el.classList.add('log');
    el.innerHTML = message;
    addMessageElement(el, options);
  }

  const addChatTyping = (data) => {
    data.typing = true;
    data.message = 'is typing';

    // console.log('addChatTyping', data);
    // addChatMessage(data);
    aaa(data,'');
  }
  const aaa = (data,options) => {

    // console.log('탸핑', typingMessages);
    var hoho = [data];
    var typingMessages = document.createElement('div');
    hoho.filter( jayeon => {
      typingMessages.classList.add('typing');
      typingMessages.classList.add('message');
      typingMessages.innerText = jayeon.username;
    });

    options = options || {};
    if(typingMessages.length !== 0) {
      options.fade = false;
      typingMessages.remove();
    }

    var usernameDiv = document.createElement('span');
    usernameDiv.classList.add('username');
    usernameDiv.style.color = getUsernameColor(data.username);
    usernameDiv.innerText = data.username+' : ';
    var messageBodyDiv = document.createElement('span');
    messageBodyDiv.classList.add('messageBody');
    messageBodyDiv.innerText = data.message;

    var typingClass = data.typing ? 'typing' : '';

    var messageDiv = document.createElement('li');
    // messageDiv.classList.add('message');
    // messageDiv.innerText = data.username;
    messageDiv.classList.add(typingClass);
    // messageBodyDiv.classList.add(typingClass);

    messageDiv.append(usernameDiv, messageBodyDiv);


    addMessageElement(messageDiv, options);
  }
  const updateTyping = () => {
    if(connected) {
      if(!typing) {
        typing = true;
        socket.emit('typing');

      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(() => {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          document.querySelector('.typing').remove();
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  const addMessageElement = (el, options) => {

    var elTwo = el;

    //기본옵션 셋업
    if(!options) {
      options= {};
    }
    if(typeof options.fade === 'undefined'){
      options.fade = true;
    }
    if(typeof options.prepend == 'undefined') {
      options.prepend = false;
    }

    //옵션 적용
    if(options.fade) {
      elTwo.classList.add('show');
      elTwo.classList.remove('hide');
    }
    if(options.prepend) {
      //메세지 나오는거 전에 추가
      messages.prepend(elTwo);
    } else {
      messages.append(elTwo);
      console.log('elTwo append',elTwo);
    }

    messages.scrollTop = messages.scrollHeight;
  }
  loginPage.onclick = () => {
    inputMessage.focus();
  }

  inputMessage.onclick = () => {
    inputMessage.focus();
  }

  inputMessage.addEventListener('input', () => {
    updateTyping();
  });

  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  socket.on('typing', (data) => {

    addChatTyping(data);
  });


  socket.on('user joined', (data) => {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  })

  socket.on('disconnect', () => {
    log('you have been disconnected');
  });


};

