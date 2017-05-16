const {User} = require('../models/user');

function getNetwork(socket) {
    socket.on('/self/getNetwork', data => {    
        User.find({}).then(users => {                
            socket.emit('/user/getNetwork/success', JSON.stringify(users));
        }).catch(err => {
            socket.emit('/user/getNetwork/fail', err);
        });
    });
}

function updateLocation(socket) {
    socket.on('/self/updateLocation', loc => {
        User.updateOne(
            {_id:socket.userId}, 
            {
                $set: {
                    loc: {
                        type: "Point",
                        coordinates: loc
                    }
                }
            },
            {new: false, runValidators: true}            
        ).then((res) => {
            
        });
    });
}

module.exports = {
    getNetwork
};