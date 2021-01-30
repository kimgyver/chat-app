const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPatg = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPatg));

let count = 0;

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', ({ username, room }) => {
    socket.join(room);

    socket.emit('message', generateMessage('Welcome!'));
    socket.broadcast
      .to(room)
      .emit('message', generateMessage(`${username} has joined!`));

    // socket.emit(specific user)
    // io.emit (to all users). socket.broadcast.emit (to all users except oneself)
    // io.to.emit (to all users in specific room), socket.to.emit (to all users in specific room except oneself)
  });

  socket.on('sendMessageToAll', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.to('CBD').emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    io.emit(
      'locationMessage',
      generateLocationMessage(
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'));
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
