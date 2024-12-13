const express = require('express');
const chatRouter = express.Router();
const chatController = require('../controllers/chatBotController');
const isLoggedIn = require('../authentication/authentication');

chatRouter.post('/query', chatUtils.askChatbot);

module.exports = chatRouter;
