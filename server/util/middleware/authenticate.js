const {User} = require('../../models/user');
const socketioJwt = require('socketio-jwt');

let authenticateUserToken = (token) => {
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        //call next to move on
        next();
    }).catch((err) => {
        return res.status(401).send();
    });
}

let authenticateToken = socketioJwt.authorize({
    secret: process.env.JWT_SECRET,
    handshake: true
})

module.exports = {authenticateUserToken, authenticateToken}
