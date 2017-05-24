const {User} = require('../models/user');
const {Chatroom} = require('../models/chatroom');
const {Message} = require('../models/message');
const {ObjectID} = require('mongodb');

function getChatrooms(socket) {
    socket.on('/self/getChats', () => {
        User.find({_id: socket.userId}, {chatrooms: 1}).then(userChatrooms => {
            if (!userChatrooms) {
                Promise.reject();
            }

            Chatroom.find({
                _id: {$in: userChatrooms}
            }).then(chatrooms => {
                if (chatrooms) {
                    socket.emit('/self/getChats/success', chatrooms);
                }
            });

        }).catch(err => {
            socket.emit('/self/getChats/fail', err);
        });
    });
}

//TODO: Add to contacts if both messages are exchanged
function sendMessage(socket) {
    function updateChatroom(msg, callback) {
        Chatroom.findOneAndUpdate(
            {_id: msg.chatroomId},
            {$set: {lastMessage: msg.text}}
        ).then(() => {
            callback();
        }).catch(err => {
            Promise.reject(err);
        });
    }

    function saveChatroomIdToUser(userId, chatroomId, unread) {
        User.findOneAndUpdate(
            {_id: userId},
            {$push: {chatrooms: {chatroomId, unread}}}
        ).catch(err => {
            Promise.reject(err);
        });
    }

    function createNewChatroom(msg, callback) {
        const chatroom = new Chatroom({
            _id: msg.chatroomId,
            users: [
                new ObjectID(msg.senderId),
                new ObjectID(msg.toId)
            ],
            lastMessage: msg.text
        });

        chatroom.save().then(() => {
            saveChatroomIdToUser(msg.senderId, msg.chatroomId, 0);
            saveChatroomIdToUser(msg.toId, msg.chatroomId, 1);
            callback();
        }).catch(err => {
            Promise.reject(err);
        });
    }

    function saveMessageAndSend(msg) {
        const message = new Message({
            chatroomId: msg.chatroomId,
            senderId: msg.senderId,
            text: msg.text,
            date: new Date()
        });

        message.save().then(() => {
            socket.to(msg.toId).emit('message', msg);
        }).catch(err => {
            Promise.reject(err);
        });
    }

    socket.on('/self/sendMessage', msg => {
        Chatroom.findById(msg.chatroomId).then(chatroom => {
            if (!chatroom) {
                createNewChatroom(msg, () => {
                    saveMessageAndSend(msg);
                });
            } else {
                updateChatroom(msg, () => {
                    saveMessageAndSend(msg);
                });
            }
        }).catch(err => {
            socket.emit('/self/sendMessage/fail', err);
        });
    });
}

function deleteChat(socket) {
    socket.on('/self/deleteChat', chatroomId => {
        User.findOneAndUpdate(
            {_id: socket.userId},
            {$pull: {chatrooms: {chatroomId}}}
        ).then(() => {
            socket.emit('/self/deleteChat/success', chatroomId);
        }).catch(err => {
            socket.emit('/self/deleteChat/fail', err);
        });
    });
}

module.exports = {
    getChatrooms,
    sendMessage,
    deleteChat
};