const {User} = require('../models/user');

function getNetwork(socket) {
    socket.on('/user/getNetwork', data => {
        console.log(data);
        User.find({}).then(users => {                
            socket.emit('/user/getNetwork/success', JSON.stringify(users));
        }).catch(err => {
            socket.emit('/user/getNetwork/fail', err);
        });
    });
}

module.exports = {
    getNetwork
};