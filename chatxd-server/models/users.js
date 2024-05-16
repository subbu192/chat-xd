const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required']
    },
    userName: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username should be unique'],
        lowercase: true,
        minlength: [5, 'Minimum Length of Username should be 5']
    },
    userPhone: {
        type: String,
        required: [true, 'Phone Number is required'],
        unique: [true, 'Phone number should be unique']
    },
    userPass: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Minimum Length of Password should be 6']
    }
});

module.exports = mongoose.models.user ? mongoose.models.user : mongoose.model('user', UserSchema);