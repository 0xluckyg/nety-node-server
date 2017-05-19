const {User} = require('../models/user');
//[longitude, latitude]

const maxDist = 10000;

function getNetwork(socket) {
    socket.on('/self/getNetwork', loc => {    
        User.find({
            loc : {
                $near : {
                    $geometry : { type : "Point" , coordinates : loc }, 
                    $maxDistance : maxDist
                }
            }
        }).then(users => {                
            socket.emit('/self/getNetwork/success', JSON.stringify(users));
        }).catch(err => {
            socket.emit('/self/getNetwork/fail', err);
        });
    });
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
        ).then((res) => {                        
            socket.emit('/self/updateLocation/success', newLoc);            
            // console.log('wtf',res.loc);
            findUsersNearAndNotify(res.loc);
        }).catch(err => {
            socket.emit('/self/updateLocation/fail', err);
        });
    });

    function findUsersNearAndNotify(location) {        
        User.find({
            loc : {
                $near : {
                    $geometry : location, 
                    $maxDistance : maxDist
                }
            },
            _id: { $ne:socket.userId }
        },{ loc: 1, name: 1 }).then(users => {            
            if (!users || users.length === 0) {
                return;
            }            
            users.forEach(user => {
                console.log(user.name, users.length);
                // console.log(getDist(user.loc.coordinates, location.coordinates));                
                const userLocation = {_id: socket.userId, loc: location.coordinates};
                // console.log('hm', userLocation);
                io.to(`${user._id}`).emit('/user/updateLocation', userLocation);                
            });
            // console.log('END')
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