const express = require('express');

const Chat = require('../models/chats');

const router = express.Router();

router.post('/addChat', async (req, res) => {
    try {
        const givenData = req.body;

        const newChat = new Chat(givenData);
    
        const success = await newChat.save();
    
        if (success) {
            res.status(200).json({ msgData: givenData });
        } else {
            res.status(400).json({ error: 'Chat Save failed' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Chat Save failed due to Internal Error.' });
    }
})

router.post('/getChats', async (req, res) => {
    try {
        const givenData = req.body;

        const chatList = await Chat.find({ $or: [{ fromID: givenData.fromID, toID: givenData.toID }, { fromID: givenData.toID, toID: givenData.fromID }]});

        if (chatList) {
            res.status(200).json({ chatList: chatList });
        } else {
            res.status(400).json({ error: 'Chat Fetch failed' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Chat Fetch failed due to Internal Error.' });
    }
})

module.exports = router;