const express = require('express');

const router = express.Router();

const userAuth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.get('/', userAuth.authenticate, chatController.getChats);

router.post('/sendMessage', userAuth.authenticate, chatController.postSendMessage);

module.exports = router;