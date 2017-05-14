const {ObjectID} = require('mongodb');
const {Chatroom} = require('../models/chatroom');
const {Message} = require('../models/message');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');

const users = [
    {
        age: 20,
        name: {first: 'first1', last: 'last1'},
        email: 'TestUser1@email.com',
        password: 'somepw123'
    },
    {
        age: 30,
        name: {first: 'first2', last: 'last2'},
        email: 'TestUser2@email.com',
        password: 'somepw123'
    },
    {
        age: 40,
        name: {first: 'first3', last: 'last3'},
        email: 'TestUser3@email.com',
        password: 'somepw123'
    }
];

function populateUser(done) {
    User.remove({}).then(() => {
        done();
    });
}

function populateChatrooms(done) {
    Chatroom.remove({}).then(() => {
        done();
    });
}

function populateMessages(done) {
    Message.remove({}).then(() => {
        done();
    });
}

module.exports = {
    users,

    populateChatrooms,
    populateMessages,
    populateUser
};