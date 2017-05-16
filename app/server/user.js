const {User} = require('../models/user');
const {ObjectID} = require('mongodb');

function updateUser(socket) {
    socket.on('/self/update', user => {
        const _id = socket.userId;

        if (!ObjectID.isValid(_id)) {
            return socket.emit('/criticalError');
        }

        User.findOneAndUpdate(
            {_id}, {$set: user}, 
            {new: true, runValidators: true})
        .then((res) => {
            if (!res) {
                return socket.emit('/criticalError');
            }
            socket.emit('/self/update/success', res);            
        }).catch((err) => {
            socket.emit('/self/update/fail', err);
        });        
    });
}

function getUserByToken(socket) {
    socket.on('/self/getByToken', () => {
        User.findByToken(socket.userToken).then(user => {
            if (!user) {
                return socket.emit('/criticalError', user);
            }
            socket.emit('/self/getByToken/success', user);

        }).catch(err => {
            socket.emit('/self/getByToken/fail', err);
        });
    });
}

function getUserById(socket) {
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
}

module.exports = {
    updateUser,
    getUserByToken,
    getUserById
};