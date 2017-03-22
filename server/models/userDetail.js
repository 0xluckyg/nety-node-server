const mongoose = require('mongoose');

let UserDetail = mongoose.model('UserDetail', {
    chatrooms: [{
        chatroomID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        notification: {
            type: Number,
            default: 0
        }
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }]
});

module.exports = {UserDetail};
