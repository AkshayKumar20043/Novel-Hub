const chatbotResponses = require('./chatBotResponses');

const askChatbot = (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const userMessage = message.toLowerCase();
    
    // Find matching response
    const matchingResponse = chatbotResponses.find(item => 
        item.keywords.some(keyword => userMessage.includes(keyword))
    );

    if (matchingResponse) {
        res.json({ response: matchingResponse.response });
    } else {
        res.json({ 
            response: "Hmm I am not sure about that question, you can ask someting else :)" 
        });
    }
};

module.exports = {
    askChatbot
};
