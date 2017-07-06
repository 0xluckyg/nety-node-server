require('./config/config');
require('./db/mongoose');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {authenticateToken} = require('./middleware/authenticate');
const {signup, login} = require('./server/authentication');
const {getChatrooms, getMessages, readMessage, sendMessage, deleteChat} = require('./server/chat');
const {getContacts, deleteContact, addContact} = require('./server/contact');
const {getNetwork, updateLocation} = require('./server/network');
const {logoutUser, blockUser, unblockUser, changeDiscoverableSetting} = require('./server/settings');
const {getUserById, getUserByToken, updateUser} = require('./server/user');

//DEV PURPOSES
// const {populateUsers, clearUsers} = require('./tests/seed');
// clearUsers();
// populateUsers();

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, FETCH, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const server = http.createServer(app);
const io = socketIO(server);

signup(app);
login(app);

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

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
    updateUser(socket); //REQUIRED: offline sync //TODO: send update to all users

    // //NETWORK
    getNetwork(socket);
    updateLocation(socket, io);

    // //CONTACTS
    getContacts(socket); //REQUIRED: offline sync, pagination, sort
    deleteContact(socket);
    addContact(socket);

    // //CHAT
    getChatrooms(socket); //REQUIRED: offline sync, pagination, sort
    deleteChat(socket);    
    getMessages(socket); //REQUIRED: offline sync, pagination, sort
    sendMessage(socket, io);
    readMessage(socket);    

    // //SETTINGS    
    blockUser(socket); //REQUIRED: offline sync
    unblockUser(socket); //REQUIRED: offline sync
    logoutUser(socket, io); 
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