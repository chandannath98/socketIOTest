const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Handle socket connections
io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);
      io.to(socket.id).emit('SocketID', socket.id);

  // Handle incoming messages
  socket.on('message', (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all connected clients
    io.emit('message', message);
  });
  
  socket.on('privateMessage', ({ recipientUserId, message }) => {
    console.log(recipientUserId)
    if (recipientUserId) {
      io.to(recipientUserId).emit('newMessage', message);
    }
  });

  

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
     io.emit('disconnected_user', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
