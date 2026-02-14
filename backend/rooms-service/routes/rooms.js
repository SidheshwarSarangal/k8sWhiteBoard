const express = require('express');
const router = express.Router();
const {
  createRoom,
  getRoom,
  getRoomsByOwner,
  updateRoomPassword,
  joinRoom,
} = require('../controllers/roomController');
const verifyToken = require('../middleware/auth');
const { validateRoomCreation } = require('../middleware/validation');

router.post('/', validateRoomCreation, createRoom);
router.get('/getRoomsByOwner', getRoomsByOwner);
router.get('/private/:id', verifyToken, getRoom);
router.get('/:id', getRoom);
router.put('/rooms/:roomId', updateRoomPassword);
router.post('/join', joinRoom);

module.exports = router;
