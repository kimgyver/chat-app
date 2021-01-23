const socket = io();

socket.on('message', (msg) => {
  console.log(msg);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();

  //   const message = document.querySelector('input').value;
  const message = e.target.elements.message.value;
  socket.emit('sendMessageToAll', message);
});

// socket.on('countUpdated', (count) => {
//   console.log('The count has been updated!', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('clicked');
//   socket.emit('increment');
// });
