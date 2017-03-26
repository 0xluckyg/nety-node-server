require('./config/config');
const path = require('path');
const http = require('http');
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
app.use(bodyParser.json());
app.use(express.static(publicPath));

app.post('/signup', function (req, res) {
    console.log(req.body)
    let body = _.pick(req.body, ['age', 'name', 'email', 'password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        console.log(token)
        console.log(user)
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        console.log(err)
        res.status(400).send(JSON.stringify(err));
    })
});

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    // console.log('client connected');

    socket.on('user.signup', (data) => {
        // console.log(data);
        // console.log(socket.handshake)
        socket.emit('message', 'user signup called');
    })

    socket.on('user.get', (token) => {

    })

    socket.on('user.login', (data) => {

    })

    socket.on('user.logout', (token) => {

    })
})

server.listen(port, () => {
    console.log('Started on port: ', port);
});

module.exports = {server}
