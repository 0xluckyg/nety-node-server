const mongoose = require('mongoose');

const UserProperty = mongoose.model('UserDetail', {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    chatrooms: [{
        chatroomId: String,
        unread: {
            type: Number,
            default: 0
        }
    }],
    contacts: [mongoose.Schema.Types.ObjectId]
});

module.exports = {UserProperty};
