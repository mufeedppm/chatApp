const express = require('express');

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();

const userAuth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.get('/getChats', userAuth.authenticate, chatController.getChats);

router.post('/sendMessage', userAuth.authenticate, chatController.postSendMessage);

router.post('/upload-media', upload.single('file'), chatController.uploadMedia);


module.exports = router;