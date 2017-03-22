const mongoose = require('mongoose');

//Creating a new todo example
let Message = mongoose.model('Messages', {
    chatroomID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        minlength: 1,
        maxlength: 1000,
        trim: true,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

module.exports = {Message};
