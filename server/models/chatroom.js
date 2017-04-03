const mongoose = require('mongoose');

//Creating a new todo example
let Chatroom = mongoose.model('Chatroom', {
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    lastMessage: mongoose.Schema.Types.ObjectId
});

module.exports = {Chatroom};
