const {User} = require('../models/user');
const {ObjectID} = require('mongodb');

function updateUser(socket) {
    socket.on('/self/update', user => {
        // const _id = socket.userId;

        // if (!ObjectID.isValid(_id)) {
        //     return socket.emit('/criticalError', user);
        // }

        // User.findOneAndUpdate({_id}, {$set: user}, {new: true}).then((user) => {
        //     if (!user) {
        //         return socket.emit('/criticalError', user);
        //     }
        //     socket.emit('/me/update/success', user);
        // }).catch((err) => {
        //     socket.emit('/me/update/fail', {err});
        // });

        socket.emit('/self/update/success');
    });
}

function getUserByToken(socket) {
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