const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const verifyToken = require('../middleware/auth');
const { validateMessage } = require('../middleware/validation');

router.post('/', verifyToken, validateMessage, sendMessage);
router.get('/:roomId', verifyToken, getMessages);

module.exports = router;
