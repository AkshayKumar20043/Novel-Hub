const express = require('express');
const chatRouter = express.Router();
const chatUtils = require('../utils/chatBot');
const isLoggedIn = require('../authentication/authentication');

chatRouter.post('/query', chatUtils.askChatbot);

module.exports = chatRouter;