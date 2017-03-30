require('./config/config');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const {authenticateToken} = require('./util/middleware/authenticate');
const {hub} = require('./util/hub');

const port = process.env.PORT;

var app = express();
app.use(bodyParser.json());

hub.onSignup(app);
hub.onLogin(app);

const server = http.createServer(app);
const io = socketIO(server);

//Global authorization: required a token to connect to our socket
io.use(authenticateToken);

io.on('connection', (socket) => {
    console.log(socket.handshake.query.token)

    socket.on('user.get', (token) => {

    })

    socket.on('user.login', (data) => {

    })

    socket.on('user.logout', (token) => {
        socket.emit('user.logout.success', true)
    })
})

server.listen(port, () => {
    console.log('Started on port: ', port);
});

module.exports = {server}
