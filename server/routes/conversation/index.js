const express = require('express');
const controller = require('./conversation.controller');

const {authenticate} = require('../../middleware/authenticate');

var router = express.Router();

router.post('/start', authenticate, controller.startConversation)

router.post('/send', authenticate, controller.sendMessage);

router.get('/all', authenticate, controller.getConversations);

router.get('/users', authenticate, controller.getUsers);

module.exports = router;