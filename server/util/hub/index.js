const _ = require('lodash');
const {User} = require('../../models/user');
const {UserProperty} = require('../../models/UserProperty');
const {Message} = require('../../models/message');
const {Chatroom} = require('../../models/chatroom');

const hub = {
    onSignup: function(app) {
        app.post('/signup', function (req, res) {
            let body = _.pick(req.body, ['age', 'name', 'email', 'password']);
            let user = new User(body);

            user.save().then(() => {
                return user.generateAuthToken();
            }).then(token => {
                res.header('x-auth', token).send(user);
            }).catch(err => {
                if (err.errors != undefined) {
                    let errorMessage = err.errors[Object.keys(err.errors)[0]].message;
                    res.status(400).send(errorMessage);
                } else {
                    res.status(400).send(JSON.stringify(err));
                }
            })
        });
    },
    onLogin: function(app) {
        app.post('/login', function (req, res) {
            let body = _.pick(req.body, ['email', 'password']);
            let user = new User(body);
            User.findByCredentials(body.email, body.password).then(user => {
                return user.generateAuthToken().then(token => {
                    res.header('x-auth', token).send(user);
                });
            }).catch(err => {
                res.status(400).send(JSON.stringify(err));
            })
        });
    },
    updateUser: function(socket) {
        socket.on('/user/update', user => {
            const id = user._id

            if (!ObjectID.isValid(_id)) {
                return Promise.reject();
            }

            User.findOneAndUpdate({_id: id}, {$set: user}, {new: true}).then((user) => {
                if (!user) {
                    return Promise.reject();
                }

                socket.emit('/user/update/success', user);

            }).catch((err) => {
                socket.emit('/user/update/fail', {err});
            })
        })
    },
    logoutUser: function(socket) {
        socket.on('/user/logout', token => {
            User.findByToken(token).then(user => {
                if (!user) {
                    return Promise.reject();
                }

                user.removeToken(token).then(() => {
                    socket.emit('/user/logout/success')
                }, () => {
                    return Promise.reject()
                })

            }).catch(err => {
                socket.emit('/user/logout/fail', {err})
            });
        });
    },
    getUserByToken: function(socket) {
        socket.on('/user/getByToken', token => {
            User.findByToken(token).then(user => {
                if (!user) {
                    return Promise.reject()
                }

                socket.emit('/user/getByToken/success', user);

            }).catch(err => {
                socket.emit('/user/getByToken/fail', err);
            })
        })
    },
    getUserById: function(socket) {
        socket.on('/user/getById', id => {
            User.findById(id).then(user => {
                if (!user) {
                    return Promise.reject()
                }

                socket.emit('/user/getById/success', user)

            }).catch(err => {
                socket.emit('/user/getById/fail', err)
            })
        })
    },
    getNetwork: function(socket) {
        socket.on('/user/getNetwork', loc => {
            User.find().then(users => {
                if (!users) {
                    return Promise.reject()
                }

                socket.emit('/user/getNetwork/success', users)

            }).catch(err => {
                socket.emit('/user/getNetwork/fail', err)
            })
        })
    },
    getChatrooms: function(socket) {
        socket.on('/user/getChats', id => {
            UserProperty.find({userID: id}).then(userProperty => {
                if (!userProperty) {
                    return Promise.reject()
                }

                Chatroom.find({
                    _id: {$in: userProperty.chatrooms}
                }).then(chatrooms => {
                    if (chatrooms) {
                        socket.emit('/user/getChats/success', chatrooms)
                    }
                });

            }).catch(err => {
                socket.emit('/user/getChats/fail', err)
            })
        })
    },
    getContacts: function(socket) {
        socket.on('/user/getContacts', id => {
            UserProperty.find({userID: id}).then(userProperty => {
                if (!userProperty) {
                    return Promise.reject()
                }

                User.find({
                    _id: {$in: userProperty.contacts}
                }).then(contacts => {
                    if (contacts) {
                        socket.emit('/user/getChats/success', contacts)
                    }
                })

            }).catch(err => {
                socket.emit('/user/getChats/fail', err)
            })
        })
    },
    joinRoom: function(socket) {
        socket.on('/room', id => {
            socket.join(id);
        })
    },
    message: function(socket) {
        socket.on('/message', msg => {
            let message = new Message(msg);
            message.save().then(() => {
                socket.broadcast.to(msg.chatId).emit('message', msg);
            }).catch(err => {
                socket.emit('/message/fail', err)
            })
        })
    }
}

module.exports = {hub};
