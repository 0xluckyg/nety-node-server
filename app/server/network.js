const {User} = require('../models/user');
const _ = require('lodash');
//[longitude, latitude]

const maxDist = 10000;
const maxDistForBroadcast = 15000;

function getNetwork(socket) {
    socket.on('/self/getNetwork', loc => {         
        User.findOne(
            {_id: socket.userId},
            {blocked: 1}
        ).then(user => {                        
            findUsers(user, loc);
        });
    });

    function findUsers(user, loc) {
        User.find({            
            loc : {
                $near : {
                    $geometry : { type : "Point" , coordinates : loc },
                    $maxDistance : maxDist
                }
            },
            _id: {$ne:socket.userId, $nin: user.blocked},            
            blocked: { $ne: socket.userId },
            discoverable: true
        },{ 
            token: 0, password: 0, chatrooms: 0, contacts: 0, blocked: 0
        }).then(users => {                 
            socket.emit('/self/getNetwork/success', users);
        }).catch(err => {
            socket.emit('/self/getNetwork/fail', err);
        });
    }
}

function updateLocation(socket, io) {
    socket.on('/self/updateLocation', newLoc => {        
        User.findOneAndUpdate(
            {_id:socket.userId},
            {
                $set: {
                    loc: { type: "Point", coordinates: newLoc }
                }
            },
            {new: true, runValidators: true}            
        ).then(res => {                                
            findUsersNearAndNotify(res);
        }).catch(err => {
            socket.emit('/self/updateLocation/fail', err);
        });
    });

    function findUsersNearAndNotify(updatedUser) {                
        User.find({
            loc : {
                $near : {
                    $geometry : updatedUser.loc,
                    $maxDistance : maxDistForBroadcast
                }
            },
            _id: {$ne:socket.userId, $nin: updatedUser.blocked},            
            blocked: { $ne: socket.userId }            
        },{ _id: 1 }).then(users => {            
            if (!users || users.length === 0) {
                return;
            }                            

            updatedUser = updatedUser.toObject();
            _.omit(updatedUser, ['contacts','token','chatrooms','blocked','password','authType']);
            updatedUser.loc = updatedUser.loc.coordinates;

            users.forEach(user => {                                                              
                io.to(`${user._id}`).emit('/user/updateLocation', updatedUser);                
            });                                     
        }).then(() => {
            socket.emit('/self/updateLocation/success', updatedUser.loc);
        });
    }
}

function getDist(loc1,loc2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(loc2[1]-loc1[1]);  // deg2rad below
    const dLon = deg2rad(loc2[0]-loc1[0]);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(loc1[1])) * Math.cos(deg2rad(loc2[1])) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

module.exports = {
    getNetwork,
    updateLocation,
    getDist
};