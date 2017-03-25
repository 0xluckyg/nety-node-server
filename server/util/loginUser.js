const {User} = require('../models/user');

function loginUser(socket, user) {
    let data = _.pick(data, ['email', 'password']);

    User.findByCredentials(data.email, data.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            user.token = token;
            socket.emit('user.login.success', user);
        });
    }).catch((err) => {
        socket.emit('user.login.fail', err);
    })
}

function signupUser(socket, user) {
    let body = _.pick(req.body, ['name', 'email', 'password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    })
}

function logoutUser(socket, user) {
    req.user.removeToken(user.token).then(() => {
        socket.emit('user.logout.success', user);
    }, () => {
        socket.emit('user.logout.fail', user);
    })
}

module.exports = loginUser;
