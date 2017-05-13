const {User} = require('../models/user');

function logoutUser(socket) {
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
}

function blockUser(socket) {
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
}

function unblockUser(socket) {
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
}

function changeDiscoverableSetting(socket) {
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
}

module.exports = {
    logoutUser,
    blockUser,
    unblockUser,
    changeDiscoverableSetting
};