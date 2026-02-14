const express = require('express');
const router = express.Router();
const { addRoomToCollabs, getUserCollabs, getUserByUsername } = require('../controllers/userController');

router.post('/add-room-to-collabs', addRoomToCollabs);
router.get('/collabs/:username', getUserCollabs);
router.get('/by-username/:username', getUserByUsername);

module.exports = router;
