const mongoose = require('mongoose');

//Creating a new todo example

const MessageSchema = new mongoose.Schema({
    chatroomId: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        minlength: [1, 'Please provide a message'],
        maxlength: [1000, 'Please keep your message shorter than 1000 characters'],
        trim: true,
        required: true
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

MessageSchema.index({
    chatroomId: 1,
    text: 1
});

const Message = mongoose.model('Messages', MessageSchema);

module.exports = {Message};
