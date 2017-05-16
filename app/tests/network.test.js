const expect = require('expect');
const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');
const {users, exampleToken} = require('./seed');
const io = require('socket.io-client');
const url = 'http://localhost:3000';

function getNetworkTest() {
    describe('get network', () => {
        let client1;
        let client2;

        beforeEach((done) => {               
            User.remove({}).then(() => {
                 client1 = io.connect(url, { 'query': 'token=' + exampleToken });
                 client1.on('connect', () => {
                    client2 = io.connect(url, {'query': 'token=' + exampleToken});
                    client2.on('connect', () => done());
                 });
            });
        });
        afterEach((done) => {
            client1.disconnect();
            client2.disconnect();
            done();
        });

        it('should return users in 10km radius', (done) => {

        });

        it('should not return blocked user', (done) => {

        });

        it('should not return user who blocked self', (done) => {

        });

        it('should broadcast user after signup', (done) => {
            const mock = users[0];            
            request(server)
            .post('/signup')
            .send(mock)            
            .end((err, res) => {                
                expect(res.headers['x-auth']).toExist();
                const socket = io.connect(url, {
                    'query': 'token=' + res.headers['x-auth']
                });                                                
                socket.on('connect', () => {                    
                    done();
                });                       
            });
        });

        it('should broadcast user after login', (done) => {
            const mock = users[0];            
            request(server)
            .post('/login')
            .send({email:mock.email, password:mock.password})            
            .end((err, res) => {                
                expect(res.headers['x-auth']).toExist();
                const socket = io.connect(url, {
                    'query': 'token=' + res.headers['x-auth']
                });                                                
                socket.on('connect', () => {                    
                    done();
                });                                
            });
        });

    });
}

module.exports = {
    getNetworkTest
};