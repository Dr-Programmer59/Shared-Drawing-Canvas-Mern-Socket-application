const http = require('http');
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const {v4: createRoomID} = require('uuid');

const port = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.get('/',(req,res) => {
    res.send('server is working');
});

const server = http.createServer(app);

const io = socketio(server);

const users = [{}];

//sockets
io.on('connection', (socket)=>{
  console.log('new connection');

  socket.on('create-room',({userId}) => {
    const roomId = createRoomID();
    socket.join(roomId);
    users[userId] = {name: 'Admin', roomId}
    io.to(userId).emit('create-room',{roomId});
  });

  socket.on('join-room',({roomId, userId, name}) => {
    users[userId] = {name,roomId};
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('new-user',{name});
  });

  socket.on('send-element',({elements, roomId}) => {
    socket.broadcast.to(roomId).emit('recive-element',{elements});
  });

  socket.on('mirror',({roomId, width, height, zoom, scrollTop, scrollLeft, zoomPoint}) => {
    socket.broadcast.to(roomId).emit('mirror',{width, height, zoom, scrollTop, scrollLeft, zoomPoint});
  });

  socket.on('send-message',({message, roomId, userId}) => {
    const user = users[userId];
    console.log(user.name)
    socket.broadcast.to(roomId).emit('send-message',{message, name: user.name, id: userId});
  });

  socket.on('typing',({roomId, userId}) => {
    console.log('typing');
    const user = users[userId];
    socket.broadcast.to(roomId).emit('typing',{name: user.name});
  });

  socket.on('disconnect',() => {
    // console.log('disconnect', users[socket.id]);
    const user = users[socket.id];
    if(user){
      socket.broadcast.to(user.roomId).emit('leave',{name: user.name});
    }
    delete users[socket.id];
  });

});

server.listen(port,() => {
    console.log(`server is working on ${port}`);
});
