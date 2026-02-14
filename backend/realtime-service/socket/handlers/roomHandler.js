module.exports = (io, socket) => {
  socket.on('join_room', ({ roomId, username }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username || 'anonymous';

    console.log(`${socket.username} joined room ${roomId}`);
    socket.to(roomId).emit('user_joined', { username: socket.username, socketId: socket.id });
  });
};
