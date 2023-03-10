const express = require('express');
const messageController = require('../controllers/messages-controller');
const router = express.Router();

router.get('/messages', messageController.getAddMessages);

router.post('/messages', messageController.addMessage);

router.delete('/messages/:id', messageController.deleteMessage);

module.exports = router;
