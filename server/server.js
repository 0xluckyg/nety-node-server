require('./config/config');
const path = require('path');
const https = require('https');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const mongoose = require('./db/mongoose');
const {User} = require('./models/user');
const {UserProperty} = require('./models/UserProperty');
const {message} = require('./models/message');
const {chatroom} = require('./models/chatroom');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT;

var app = express();
const server = https.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json());
app.use(express.static(publicPath));

io.on('connection', (socket) => {

    socket.on('user.create', (data) => {

    })

    socket.on('user.get', (token) => {

    })

    socket.on('user.login', (data) => {
        let data = _.pick(data, ['email', 'password']);

        User.findByCredentials(data.email, data.password).then((user) => {
            return user.generateAuthToken().then((token) => {
                user.token = token;
                socket.emit('user.login.success', user);
            });
        }).catch((err) => {
            socket.emit('user.login.fail', err);
        })
    })

    socket.on('user.logout', (token) => {

    })

})

app.listen(port, () => {
    console.log('Started on port: ', port);
});

module.exports = {app}
