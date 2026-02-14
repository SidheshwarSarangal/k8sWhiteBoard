module.exports = (io, socket) => {
  socket.on('get_users', (roomId, callback) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const clients = room ? Array.from(room) : [];
    if (typeof callback === 'function') callback(clients);
  });
};
