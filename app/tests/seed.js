const {ObjectID} = require('mongodb');
const {Chatroom} = require('../models/chatroom');
const {Message} = require('../models/message');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');

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
    populateChatrooms,
    populateMessages,
    populateUser
};