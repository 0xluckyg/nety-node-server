const expect = require('expect');
const {User} = require('../models/user');

function sendMessageTest() {
    describe('send message', () => {
        it ('should save message and notify self', (done) => {

        });

        it ('should save message and notify other user', (done) => {

        });

        it ('should create contact if messages are exchanged', (done) => {

        });

        it ('should create a chatroom and save chatrooms to userProperties if first message is sent', (done) => {

        });
    });
}

function getMessagesTest() {

}

function readMessageTest() {

}

function deleteChatTest() {
    describe('delete chat', () => {
        it ('should delete chat and notify self', (done) => {
            
        });
    });
}

function getChatroomsTest() {
    describe('get chatrooms', () => {
        it ('should return chatrooms', (done) => {

        });

        it ('should not return blocked user', (done) => {

        });

        it ('should not return user who blocked self', (done) => {

        })
    });
}

module.exports = {
    sendMessageTest,
    getMessagesTest,
    readMessageTest,
    deleteChatTest,
    getChatroomsTest
};