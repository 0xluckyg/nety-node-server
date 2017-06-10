const mongoose = require('mongoose');

//Creating a new todo example

const ChatroomSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    users: [{
        userId: mongoose.Schema.Types.ObjectId,
        unread: {
            type: Number,
            default: 0
        }
    }],
    lastMessage: {
        sender: mongoose.Schema.Types.ObjectId,
        text: {            
            type: String,
            required: true            
        }
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

const Chatroom = mongoose.model('Chatrooms', ChatroomSchema);

module.exports = {Chatroom};
