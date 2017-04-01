const mongoose = require('mongoose');

let UserProperty = mongoose.model('UserDetail', {
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    chatrooms: [{
        chatroomID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        unread: {
            type: Number,
            default: 0
        }
    }],
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }]
});

module.exports = {UserProperty};
