require('./config/config');
require('./db/mongoose');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {authenticateToken} = require('./util/middleware/authenticate');
const {hub} = require('./util/hub');

const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());

hub.onSignup(app);
hub.onLogin(app);

const server = http.createServer(app);
const io = socketIO(server);

//Global authorization: required a token to connect to our socket
io.use(authenticateToken);

io.on('connection', socket => {
    console.log('client connected');

    //Make client pass on userId as a query , and set userId to socket object
    socket.userId = new ObjectID(socket.handshake.query.userId);
    //Save token to the socket object
    socket.userToken = socket.handshake.query.token;

    //This is to join the user by user's own Id so that other users can send messages to the user's socket.
    socket.join(socket.userId);

    //USER
    hub.getUserByToken(socket);

    hub.getUserById(socket);

    hub.updateUser(socket);

    hub.logoutUser(socket);

    //USER PROPERTY
    hub.getNetwork(socket);

    hub.getChatrooms(socket);

    hub.getContacts(socket);

    //ACTION
    hub.sendMessage(socket);
});

server.listen(port, () => {
    console.log('Started on port: ', port);
});

module.exports = {server};
