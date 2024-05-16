const mongoose = require('mongoose');

const FrndSchema = new mongoose.Schema({
    userPhone: {
        type: String,
        required: [true, 'UserPhone is required'],
        unique: [true, 'Phone Number should be unique']
    },
    userName: {
        type: String,
        required: [true, 'User name is required']
    },
    frndList: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.models.frnd ? mongoose.models.frnd : mongoose.model('frnd', FrndSchema);