const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPatg = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPatg));

let count = 0;

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.emit('message', 'Welcome!');

  socket.on('sendMessageToAll', (message) => {
    io.emit('message', message);
  });

  //   socket.emit('countUpdated', count); // only to client triggering 'connection'

  //   socket.on('increment', () => {
  //     console.log('INCREMENT recieved');
  //     count++;
  //     //socket.emit('countUpdated', count); // only to client triggering 'increment'
  //     io.emit('countUpdated', count); // to all client
  //   });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
