const _ = require('lodash');
const {User} = require('../../models/user');
const {UserProperty} = require('../../models/UserProperty');
const {Message} = require('../../models/message');
const {Chatroom} = require('../../models/chatroom');
const {ObjectID} = require('mongodb');


//TODO: DON"T FETCH BLOCKED USER
const hub = {
    onSignup: function(app) {
        function createUserProperty(userId, callback) {
            const userProperty = new UserProperty({userId: userId});
            userProperty.save().then(() => {
                callback();
            }).catch(err => {
                Promise.reject(err);
            });
        }

        app.post('/signup', function (req, res) {
            const body = _.pick(req.body, ['age', 'name', 'email', 'password']);
            const user = new User(body);

            user.save().then(() => {
                return user.generateAuthToken();
            }).then(token => {
                createUserProperty(user._id, () => {
                    res.header('x-auth', token).send(user);
                });
            }).catch(err => {
                if (err.errors !== undefined) {
                    const errorMessage = err.errors[Object.keys(err.errors)[0]].message;
                    res.status(400).send(errorMessage);
                } else {
                    res.status(400).send(JSON.stringify(err));
                }
            });
        });
    },
    onLogin: function(app) {
        app.post('/login', function (req, res) {
            const body = _.pick(req.body, ['email', 'password']);
            User.findByCredentials(body.email, body.password).then(user => {
                return user.generateAuthToken().then(token => {
                    res.header('x-auth', token).send(user);
                });
            }).catch(err => {
                res.status(400).send(JSON.stringify(err));
            });
        });
    },
    updateUser: function(socket) {
        socket.on('/user/update', user => {
            const _id = socket.userId;

            if (!ObjectID.isValid(_id)) {
                return socket.emit('/criticalError', user);
            }

            User.findOneAndUpdate({_id}, {$set: user}, {new: true}).then((user) => {
                if (!user) {
                    return socket.emit('/criticalError', user);
                }
                socket.emit('/user/update/success', user);
            }).catch((err) => {
                socket.emit('/user/update/fail', {err});
            });
        });
    },
    logoutUser: function(socket) {
        const token = socket.userToken;
        socket.on('/user/logout', () => {
            User.findByToken(token).then(user => {
                if (!user) {
                    return socket.emit('/criticalError', user);
                }

                user.removeToken(token).then(() => {
                    socket.emit('/user/logout/success');
                }, () => {
                    return Promise.reject();
                });

            }).catch(err => {
                socket.emit('/user/logout/fail', err);
            });
        });
    },
    getUserByToken: function(socket) {
        socket.on('/user/getByToken', () => {
            User.findByToken(socket.userToken).then(user => {
                if (!user) {
                    return socket.emit('/criticalError', user);
                }

                socket.emit('/user/getByToken/success', user);

            }).catch(err => {
                socket.emit('/user/getByToken/fail', err);
            });
        });
    },
    getUserById: function(socket) {
        socket.on('/user/getById', id => {
            User.findById(id).then(user => {
                if (!user) {
                    return socket.emit('/criticalError', user);
                }
                socket.emit('/user/getById/success', user);
            }).catch(err => {
                socket.emit('/user/getById/fail', err);
            });
        });
    },

    //TODO: get network based on location
    getNetwork: function(socket) {
        socket.on('/user/getNetwork', data => {
            console.log(data);
            User.find({}).then(users => {                
                socket.emit('/user/getNetwork/success', JSON.stringify(users));
            }).catch(err => {
                socket.emit('/user/getNetwork/fail', err);
            });
        });
    },

    //GET CHATROOMS:
    getChatrooms: function(socket) {
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
    },
    getContacts: function(socket) {
        socket.on('/user/getContacts', () => {
            UserProperty.find({userId: socket.userId}).then(userProperty => {
                if (!userProperty) {
                    Promise.reject();
                }

                User.find({
                    _id: {$in: userProperty.contacts}
                }).then(contacts => {
                    if (contacts) {
                        socket.emit('/user/getChats/success', contacts);
                    }
                });

            }).catch(err => {
                socket.emit('/user/getChats/fail', err);
            });
        });
    },
    deleteChat: function(socket) {
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
    },
    deleteContact: function(socket) {
        function notifyUsersOfDeletedContact(deletedUserId) {
            socket.emit('/self/deleteContact/success', deletedUserId);
            socket.to(deletedUserId).emit('/contact/deletedBy', socket.userId);
        }

        function deleteUserFromContacts(userToDeleteId) {
            UserProperty.findOneAndUpdate(
                {userId: socket.userId},
                {$pull: {contacts: userToDeleteId}}
            ).then(() => {
                UserProperty.findOneAndUpdate(
                    {userId: userToDeleteId},
                    {$pull: {contacts: socket.userId}}
                ).then(() => {
                    notifyUsersOfDeletedContact(userToDeleteId);
                }).catch(err => {
                    Promise.reject(err);
                });
            }).catch(err => {
                socket.emit('/self/deleteContact/fail', err);
            });
        }
        socket.on('/self/deleteContact', userToDeleteId => {
            deleteUserFromContacts(userToDeleteId);
        });
    },
    blockUser: function(socket) {
        socket.on('/self/blockUser', userToBlockId => {
            User.findOneAndUpdate(
                {_id: socket.userId},
                {$push: {blocked: userToBlockId}},
                {new: true}
            ).then(user => {
                socket.emit('/self/blockUser/success');
                socket.to(userToBlockId).emit('/blockedBy', user._id);
            }).catch(err => {
                socket.emit('/self/blockUser/fail', err);
            });
        });
    },
    unblockUser: function(socket) {
        socket.on('/self/unblockUser', userToUnblockId => {
            User.findOneAndUpdate(
                {_id: socket.userId},
                {$pull: {blocked: userToUnblockId}},
                {new: true}
            ).then(user => {
                socket.emit('/self/unblockUser/success');
                socket.to(userToUnblockId).emit('/unblockedBy', user._id);
            }).catch(err => {
                socket.emit('/self/unblockUser/fail', err);
            });
        });
    },
    changeDiscoverableSetting: function(socket) {
        socket.on('/self/changeDiscoverableSetting', discoverable => {
            User.findOneAndUpdate(
                {_id: socket.userId},
                {$set: {discoverable}}
            ).then(() => {
                socket.broadcast.emit('/user/discoverableSetting', discoverable);
                socket.emit('/self/changeDiscoverableSetting/success');
            }).catch(err => {
                socket.emit('/self/changeDiscoverableSetting/fail', err);
            });
        });
    },
    //TODO: Add to contacts if both messages are exchanged
    sendMessage: function(socket) {

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
};

module.exports = {hub};
