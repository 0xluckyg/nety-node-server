const mongoose = require('mongoose');

let UserProperty = mongoose.model('UserDetail', {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    chatrooms: [{
        chatroomId: mongoose.Schema.Types.ObjectId,
        unread: {
            type: Number,
            default: 0
        }
    }],
    contacts: [mongoose.Schema.Types.ObjectId],
    blocked: [mongoose.Schema.Types.ObjectId]
});

module.exports = {UserProperty};
