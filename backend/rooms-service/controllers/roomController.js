const Room = require('../models/Room');

exports.createRoom = async (req, res) => {
  const { roomId, name, isPrivate, owner, description } = req.body;

  try {
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room ID already exists' });
    }

    const newRoom = new Room({
      roomId,
      name: name || 'Untitled Room',
      isPrivate: isPrivate ?? false,
      owner,
      description: description || '',
      allowedUsers: [owner],
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findOne({ roomId: id });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRoomsByOwner = async (req, res) => {
  const { owner } = req.query;

  try {
    const rooms = await Room.find({ owner });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
  }
};

exports.updateRoomPassword = async (req, res) => {
  const { roomId } = req.params;
  const { password } = req.body;

  if (typeof password !== 'string') {
    return res.status(400).json({ message: 'Password must be provided as a string' });
  }

  try {
    const room = await Room.findOneAndUpdate(
      { roomId },
      { password, isPrivate: true },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Password updated', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.joinRoom = async (req, res) => {
  const { roomId, username, password = '' } = req.body;

  try {
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.allowedUsers && room.allowedUsers.includes(username)) {
      return res.status(200).json({ message: 'Already joined', room });
    }

    if (!room.isPrivate) {
      if (!room.allowedUsers) room.allowedUsers = [];
      room.allowedUsers.push(username);
      await room.save();
      return res.status(200).json({ message: 'Joined public room', room });
    }

    if (room.password === password) {
      if (!room.allowedUsers) room.allowedUsers = [];
      room.allowedUsers.push(username);
      await room.save();
      return res.status(200).json({ message: 'Joined private room', room });
    }

    return res.status(401).json({ message: 'Incorrect password' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
