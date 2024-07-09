// src/server.ts
import http from 'http';
import socketIo from 'socket.io';
import app from './app';

const server = http.createServer(app);
const io = new socketIo.Server(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
