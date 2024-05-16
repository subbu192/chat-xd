const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    fromID: {
        type: String,
        required: [true, 'From userID is required']
    },
    toID: {
        type: String,
        required: [true, 'To userID is required']
    },
    msgContent: {
        type: String,
        required: [true, 'Message Content is required']
    }
});

module.exports = mongoose.models.chat ? mongoose.models.chat : mongoose.model('chat', ChatSchema);