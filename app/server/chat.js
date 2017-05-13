const {UserProperty} = require('../models/userProperty');
const {Chatroom} = require('../models/chatroom');
const {Message} = require('../models/message');
const {ObjectID} = require('mongodb');

function getChatrooms(socket) {
    socket.on('/user/getChats', () => {
        UserProperty.find({userId: socket.userId}).then(userProperty => {
            if (!userProperty) {
                Promise.reject();
            }

            Chatroom.find({
                _id: {$in: userProperty.chatrooms}
            }).then(chatrooms => {
                if (chatrooms) {
                    socket.emit('/user/getChats/success', chatrooms);
                }
            });

        }).catch(err => {
            socket.emit('/user/getChats/fail', err);
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

    function saveChatroomIdToUserProperty(userId, chatroomId, unread) {
        UserProperty.findOneAndUpdate(
            {userId},
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
            saveChatroomIdToUserProperty(msg.senderId, msg.chatroomId, 0);
            saveChatroomIdToUserProperty(msg.toId, msg.chatroomId, 1);
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

    socket.on('/message', msg => {
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
            socket.emit('/message/send/fail', err);
        });
    });
}

function deleteChat(socket) {
    socket.on('/self/deleteChat', chatroomId => {
        UserProperty.findOneAndUpdate(
            {userId: socket.userId},
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