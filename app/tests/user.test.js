const expect = require('expect');
const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');
const {users, completeUsers, exampleToken, url} = require('./seed');
const io = require('socket.io-client');
const _ = require('lodash');

function updateTest() {
    describe('update', () => {
        let user; let socket;

        beforeEach((done) => {
            User.remove({}).then(() => {
                request(server)
                .post('/signup')
                .send(users[0])
                .end((err, res) => {
                    if (err) { throw Error(err); }
                    user = res.body;                    
                    socket = io.connect(url, {'query': 'token=' + res.headers['x-auth']});                    
                    socket.on('connect', () => done());                    
                });
            }); 
        });
        afterEach((done) => {
            socket.disconnect();
            done();
        });

        it('should successfully update user', (done) => {
            socket.emit('/self/update', user);
            socket.on('/self/update/success', () => {                
                console.log('happy fuck');                
                done();
            });
        });

        it('should return validation error if request invalid', (done) => {
            done();
        });

        it('should update user and broadcast', (done) => {
            done();
        });
    });
}

function getUserByTokenTest() {
    describe('get user by token', () => {
        it ('should return a valid user', (done) => {

        });

        it ('should return error if token invalid', (done) => {

        });
    });
}

function getUserByIdTest() {
    describe('get user by id', () => {
        it ('should return a valid user', (done) => {

        });

        it ('should return error if id invalid', (done) => {

        });
    })
}

module.exports = {
    updateTest,
    getUserByTokenTest,
    getUserByIdTest
};