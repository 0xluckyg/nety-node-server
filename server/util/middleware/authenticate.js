const socketioJwt = require('socketio-jwt');

let authenticateToken = socketioJwt.authorize({
    secret: process.env.JWT_SECRET,
    handshake: true
})

module.exports = {authenticateToken}
