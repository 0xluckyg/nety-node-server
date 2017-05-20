const {User} = require('../models/user');

const maxDistForBroadcast = 15000;

function logoutUser(socket, io) {    
    const token = socket.userToken;    
    socket.on('/self/logout', () => {        
        User.findByToken(token).then(user => {            
            if (!user) {
                return socket.emit('/criticalError', user);
            }

            user.removeToken(token).then(() => {
                findUsersNearAndNotify(user.loc.coordinates);
            }, () => {
                return Promise.reject();
            });

        }).catch(err => {
            socket.emit('/user/logout/fail', err);
        });
    });

    function findUsersNearAndNotify(location) {
        if (!location || location.constructor !== Array || location.length !== 2) {            
            socket.emit('/user/logout/success');
            return;
        }        
        User.find({
            loc : {
                $near : {
                    $geometry : { type: "Point", coordinates: location },
                    $maxDistance : maxDistForBroadcast
                }
            },
            _id: { $ne:socket.userId }
        },{ loc: 1 }).then(users => {                        
            if (!users || users.length === 0) { return; }                        
            users.forEach(user => {                
                io.to(`${user._id}`).emit('/user/loggedOut', socket.userId);
            });            
        }).then(() => {            
            socket.emit('/self/logout/success');            
        });
    }
}

function blockUser(socket) {
    socket.on('/self/blockUser', userToBlockId => {
        User.findOneAndUpdate(
            {_id: socket.userId},
            {$push: {blocked: userToBlockId}},
            {new: true, runValidators: true}            
        ).then(user => {
            if (!user) {
                return socket.emit('/self/blockUser/fail', 'no user');
            }
            socket.emit('/self/blockUser/success');            
            socket.to(userToBlockId).emit('/user/blocked', user._id);
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
            {new: true, runValidators: true}            
        ).then(user => {
            if (!user) {
                return socket.emit('/self/unblockUser/fail', 'no user');
            }
            socket.emit('/self/unblockUser/success');
            socket.to(userToUnblockId).emit('/user/unblocked', user._id);
        }).catch(err => {
            socket.emit('/self/unblockUser/fail', err);
        });
    });
}

function changeDiscoverableSetting(socket, io) {
    socket.on('/self/changeDiscoverable', discoverable => {
        User.findOneAndUpdate(
            {_id: socket.userId},
            {$set: {discoverable}},
            {new: true},
            {_id: 1, discoverable: 1, loc: 1}
        ).then(user => {            
            findUsersNearAndNotify(user);
        }).catch(err => {
            socket.emit('/self/changeDiscoverable/fail', err);
        });
    });

    function findUsersNearAndNotify(user) {
        if (!location || location.constructor !== Array || location.length !== 2) {            
            socket.emit('/self/changeDiscoverable/success');
            return;
        }
        User.find({
            loc : {
                $near : {
                    $geometry : user.loc,
                    $maxDistance : maxDistForBroadcast
                }
            },
            _id: { $ne:socket.userId }
        },{ loc: 1 }).then(users => {
            if (!users || users.length === 0) { return; }
            users.forEach(user => {
                io.to(`${user._id}`).emit('/user/discoverableChanged', socket.userId);
            });
        }).then(() => {
            socket.emit('/self/changeDiscoverable/success', user.discoverable);
        });
    }
}

module.exports = {
    logoutUser,
    blockUser,
    unblockUser,
    changeDiscoverableSetting
};