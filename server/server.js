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

io.on('connection', socket => {
    console.log(socket.handshake.query.token)

    //USER
    hub.getUserByToken(socket);

    hub.getUserById(socket);

    hub.updateUser(socket);

    hub.logoutUser(socket);

    //USER PROPERTY
    hub.getNetwork(socket);

    hub.getChatrooms(socket);

    hub.getContacts(socket);

    hub.joinRoom(socket);

    hub.message(socket);

})

server.listen(port, () => {
    console.log('Started on port: ', port);
});

module.exports = {server}
