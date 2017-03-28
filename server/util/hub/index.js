const _ = require('lodash');
const {User} = require('../../models/user');
const {UserProperty} = require('../../models/UserProperty');
const {message} = require('../../models/message');
const {chatroom} = require('../../models/chatroom');

const hub = {
    onSignup: function(app) {
        app.post('/signup', function (req, res) {
            let body = _.pick(req.body, ['age', 'name', 'email', 'password']);
            let user = new User(body);

            user.save().then(() => {
                return user.generateAuthToken();
            }).then((token) => {
                res.header('x-auth', token).send(user);
            }).catch((err) => {
                if (err.errors != undefined) {
                    let errorMessage = err.errors[Object.keys(err.errors)[0]].message;
                    res.status(400).send(errorMessage);
                } else {
                    res.status(400).send(JSON.stringify(err));
                }
            })
        });
    },
    onLogin: function(app) {
        app.post('/login', function (req, res) {
            let body = _.pick(req.body, ['email', 'password']);
            let user = new User(body);
            console.log(body)
            User.findByCredentials(body.email, body.password).then((user) => {
                return user.generateAuthToken().then((token) => {
                    res.header('x-auth', token).send(user);
                });
            }).catch((err) => {
                res.status(400).send(JSON.stringify(err));
            })
        });
    },
}

module.exports = {hub};
