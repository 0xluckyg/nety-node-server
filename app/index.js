require('./config/config');
require('./db/mongoose');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {authenticateToken} = require('./middleware/authenticate');
const {signup, login} = require('./server/authentication');
const {getChatrooms, sendMessage, deleteChat} = require('./server/chat');
const {getContacts, deleteContact} = require('./server/contact');
const {getNetwork, updateLocation} = require('./server/network');
const {logoutUser, blockUser, unblockUser, changeDiscoverableSetting} = require('./server/settings');
const {getUserById, getUserByToken, updateUser} = require('./server/user');

const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIO(server);

signup(app);
login(app);

//Global authorization: required a token to connect to our socket
io.use(authenticateToken);

io.on('connection', socket => {           
    //Make client pass on userId as a query , and set userId to socket object    
    socket.userId = new ObjectID(socket.handshake.query.userId);    
    //Save token to the socket object
    socket.userToken = socket.handshake.query.token;

    //This is to join the user by user's own Id so that other users can send messages to the user's socket.
    socket.join(`${socket.userId}`);

    //USER
    getUserByToken(socket);
    getUserById(socket);
    updateUser(socket);

    // //NETWORK
    getNetwork(socket);
    updateLocation(socket, io);

    // //CONTACTS
    // getContacts(socket);
    // deleteContact(socket);

    // //CHAT
    // getChatrooms(socket);    
    // sendMessage(socket);
    // deleteChat(socket);

    // //SETTINGS
    logoutUser(socket, io);
    blockUser(socket);
    unblockUser(socket);
    changeDiscoverableSetting(socket, io);

    //DISCONNECT
    socket.on('disconnect', () => {
        socket.emit('disconnected');
    });
});

server.listen(port, () => {
    console.log('Started on port: ', port);
});

module.exports = {server};