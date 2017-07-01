const {ObjectId} = require('mongodb');
const {User} = require('../models/user');
const {Chatroom} = require('../models/chatroom');
const {Message} = require('../models/message');
const _ = require('lodash');

function getChatrooms(socket) {
    socket.on('/self/getChatrooms', () => {
        User.findById(
            {_id: socket.userId}, 
            {chatrooms: 1, blocked: 1}
        ).then(user => {
            if (!user) {
                throw Error('no chatrooms');
            }            
            return Chatroom.find({
                _id: { $in: user.chatrooms },
                'users.userId': { $nin: user.blocked }
            }).sort(
                {updatedAt: -1}
            ).then(chatrooms => {
                if (chatrooms) {
                    return returnChatrooms(chatrooms);
                }
            });

        }).catch(err => {
            socket.emit('/self/getChatrooms/fail', err);
        });
    });

    function returnChatrooms(chatrooms) {        
        const fromIds = [];        
        const unreads = [];
        chatrooms.forEach(chatroom => {               
            //Adding other person's id and unread count. Only works with 2 people
            const index = _.findIndex(chatroom.users, {userId: new ObjectId(socket.userId)});            
            const otherUser = chatroom.users[(index-1)*-1].userId;

            fromIds.push(otherUser);
            unreads.push(chatroom.users[index].unread);
            
        });                                

        console.log('FROMID',fromIds);            
        console.log('UNREAD',unreads);            

        return User.find({
                _id: {$in: fromIds},
                blocked: { $ne: socket.userId }   
            },            
            { profilePicture: 1, name: 1 }
        ).then(users => {                          
            console.log('USERS', users);
            //Sort from most recent updated again
            users.sort(function(user1,user2){
                return fromIds.indexOf(user1._id.toString()) < fromIds.indexOf(user2._id.toString()) ? 1 : -1;
            });
            console.log('USERS2', users);

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
                    console.log('CHATROOMS', returnChatrooms);            
                    socket.emit('/self/getChatrooms/success', returnChatrooms);
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
        Chatroom.findOneAndUpdate(
            { _id: chatroomId, "users.userId": socket.userId },
            { $set: { "users.$.unread" : 0 } },
            { upsert: false }            
        ).then(returnChatroom => {            
            if (!returnChatroom) {                
                throw Error('no chatroom');
            }
            socket.emit('/self/readMessage/success');
        }).catch(err => {
            socket.emit('/self/readMessage/fail', err);
        });
    });
}

function getMessages(socket) {
    //getM: { start: startFromIndex, chatroomId: idOfChatroom }
    socket.on('/self/getMessages', getM => {
        Message.find({chatroomId: getM.chatroomId})
        .sort(
            {createdAt: -1}
        ).skip(getM.start)
        .limit(50)
        .then(messages => {            
            if (messages) {                
                socket.emit('/self/getMessages/success', {chatroomId: getM.chatroomId, messages});
            } else {
                socket.emit('/self/getMessages/success', {chatroomId: getM.chatroomId, messages: []});
            }
        }).catch(err => {            
            socket.emit('/self/getMessages/fail', err);
        });
    });
}

function sendMessage(socket, io) {
    socket.on('/self/sendMessage', msg => {          
        Chatroom.findOne({_id: msg.chatroomId})
        .then(chatroom => {      
            if (!msg.toId) {
                throw Error('no toId');
            }
            if (chatroom) {                
                chatroom.lastMessage = {
                    sender: socket.userId,
                    text: msg.text
                };                
                const index = _.findIndex(chatroom.users, {userId: new ObjectId(msg.toId)});
                chatroom.users[index].unread ++;
                
                return chatroom.save().then(() => {                    
                    return saveMessage(msg);
                });                
            }  

            const newChatroom = new Chatroom({
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
            });                        
            return newChatroom.save().then(() => {                                    
                return User.update(
                    { _id: socket.userId },
                    { $push: { chatrooms: msg.chatroomId } }
                ).then(() => {
                    return User.update(
                        { _id: msg.toId },
                        { $push: { chatrooms: msg.chatroomId } }
                    ).then(() => {
                        return saveMessage(msg);
                    });
                });                                
            });

        }).catch(err => {       
            console.log('WHY ERR',err);
            socket.emit('/self/sendMessage/fail', err);
        });
    });    

    function saveMessage(msg) {
        const newMessage = new Message({
            chatroomId: msg.chatroomId,
            senderId: socket.userId,
            text: msg.text                    
        });

        newMessage.save().then(savedMsg => {
            socket.emit('/self/sendMessage/success', savedMsg);
            io.to(`${msg.toId}`).emit('/user/message', savedMsg);
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