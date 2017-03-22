const mongoose = require('mongoose');

//Creating a new todo example
let Chatroom = mongoose.model('Chatroom', {
    name: {
        type: String,
        trim: true,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,        
    }
});

module.exports = {Chatroom};
