const {User} = require('../models/user');
const {Chatroom} = require('../models/chatroom');
const {Message} = require('../models/message');
const _ = require('lodash');

function getChatrooms(socket) {
    socket.on('/self/getChats', () => {
        User.find({_id: socket.userId}, {chatrooms: 1}).then(userChatrooms => {
            if (!userChatrooms) {
                Promise.reject();
            }

            return Chatroom.find({
                _id: { $in: userChatrooms }
            }).sort(
                {updatedAt: 1}
            ).then(chatrooms => {
                if (chatrooms) {
                    return returnChatrooms(chatrooms);
                }
            });

        }).catch(err => {
            socket.emit('/self/getChats/fail', err);
        });
    });

    function returnChatrooms(chatrooms) {
        const fromIds = [];        
        const unreads = [];
        chatrooms.forEach(chatroom => {       
            //Adding other person's id and unread count. Only works with 2 people     
            const index = _.findIndex(chatroom.users, {userId: socket.userId});            
            fromIds.push(chatroom.users[~index].userId);
            unreads.push(chatroom.users[index].unread);
        });

        User.find(
            {_id: {$in: fromIds}},
            {profilePicture: 1, name: 1}
        ).then(users => {
            if (users.length !== fromIds) {
                socket.emit('/self/getChats/fail');
                return;
            }

            _.sortBy(users, user => { 
                return fromIds.indexOf(user._id);
            });                    
            const returnChatrooms = [];      
            for (let i = 0; i < users.length; i++) {                
                const returnChatroom = {
                    _id: chatrooms[i]._id,
                    lastMessage: chatrooms[i].lastMessage,
                    updatedAt: chatrooms[i].updatedAt,
                    unread: unreads[i],
                    name: users[i].name,
                    picture: users[i].profilePicture,
                    senderId: users[i]._id
                };

                returnChatrooms.push(returnChatroom);

                if (i === users.length - 1) {
                    socket.emit('/self/getChats/success', returnChatrooms);
                }
            }
        });
    }
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

function readMessage(socket) {
    socket.on('/self/readMessage', chatroomId => {
        Chatroom.update(
            { _id: chatroomId, "users.userId": socket.userId },
            { $set: { "users.$.unread" : 0 } }
        ).then(() => {
            socket.emit('/self/readMessage/success');
        }).catch(err => {
            socket.emit('/self/readMessage/fail', err);
        });
    });
}

function getMessages(socket) {
    socket.on('/self/getMessages', getM => {
        Message.find({_id: getM._id})
        .sort(
            {time: 1}
        ).skip(getM.start)
        .limit(50)
        .then(messages => {
            if (messages) {                
                socket.emit('/self/getMessages/success', messages);
            }
        }).catch(err => {
            socket.emit('/self/getMessages/fail', err);
        });
    });
}

//TODO: Add to contacts if both messages are exchanged
function sendMessage(socket, io) {
    socket.on('/self/sendMessage', msg => {
        Chatroom.findOne({_id: msg.chatroomId})
        .then(chatroom => {
            if (chatroom) {
                chatroom.lastMessage = {
                    sender: socket.userId,
                    text: msg.text
                };
                const index = _.findIndex(chatroom.users, {userId: msg.toId});
                chatroom.users[index].unread ++;
                
                return chatroom.save().then(() => {
                    return sendMessage(msg);
                });                
            }  

            let newChatroom = new Chatroom();
            newChatroom = {
                _id: msg.chatroomId,
                users: [{
                    userId: socket.userId,
                    unread: 0
                }, {
                    userId: msg.toId,
                    unread: 1
                }],
                lastMessage: {
                    sender: socket.userId,
                    text: msg.text
                }
            };
            return newChatroom.save().then(() => {
                return User.update(
                    { _id: socket.userId },
                    { $push: { chatrooms: msg.toId } }
                ).then(() => {
                    return User.update(
                        { _id: msg.toId },
                        { $push: { chatrooms: socket.userId } }
                    ).then(() => {
                        return saveMessage(msg);
                    });
                });                                
            });

        }).catch(err => {
            socket.emit('/self/sendMessage/fail', err);
        });
    });    

    function saveMessage(msg) {
        let newMessage = new Message();
        newMessage = {
            chatroomId: msg.chatroomId,
            senderId: socket.userId,
            text: msg.text                    
        };
        newMessage.save().then(msg => {
            socket.emit('/user/sendMessage/success');
            io.to(`${msg.toId}`).emit('/user/message', msg);            
        });
    }
}

module.exports = {
    getChatrooms,
    sendMessage,
    deleteChat,
    getMessages,
    readMessage
};