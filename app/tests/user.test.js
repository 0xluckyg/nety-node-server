const expect = require('expect');
const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');
const {users, completeUsers, url, exampleToken} = require('./seed');
const io = require('socket.io-client');
const _ = require('lodash');

function updateTest() {
    const info = _.pick(completeUsers[0], ['status', 'summary', 'profession', 'work', 'skills', 'experiences']);

    describe('update', () => {
        let initialUser; let socket; let client1;

        beforeEach((done) => {
            User.remove({}).then(() => {
                request(server)
                .post('/signup')
                .send(users[0])
                .end((err, res) => {
                    if (err) { throw Error(err); }
                    initialUser = res.body;                    
                    socket = io.connect(url, {
                        'query': 'token=' + res.headers['x-auth'] + '&userId=' + initialUser._id
                    });       
                    socket.on('connect', () => done());                    
                });
            }); 
        });
        beforeEach(done => {
            client1 = io.connect(url, {
                'query': 'token=' + exampleToken + '&userId=' + initialUser._id
            });
            client1.on('connect', () => done());
        });
        afterEach((done) => {
            client1.disconnect();
            socket.disconnect();
            done();
        });

        it('should successfully update user', (done) => {
            socket.emit('/self/update', info);
            socket.on('/self/update/success', res => {                
                expect(res.experiences.length).toBe(info.experiences.length);
                expect(res.skills).toMatch(info.skills);
                expect(res.work).toBe(info.work);
                expect(res.profession).toBe(info.profession);
                expect(res.summary).toBe(info.summary);
                expect(res.status).toBe(info.status);                
                User.findById(initialUser._id).then(user => {
                    expect(user.experiences.length).toBe(info.experiences.length);
                    expect(user.skills).toMatch(info.skills);
                    expect(user.work).toBe(info.work);
                    expect(user.profession).toBe(info.profession);
                    expect(user.summary).toBe(info.summary);
                    expect(user.status).toBe(info.status);
                    done();
                });
            });
        });

        it('should not update if summary invalid', (done) => {
            socket.emit('/self/update', {summary: ''});
            socket.on('/self/update/fail', err => {
                console.log(err.name);
                User.findById(initialUser._id).then(user => {                    
                    expect(user.summary).toBe(null);
                    done();
                });                
            });
        });

        it('should return validation error if experience invalid', (done) => {
            socket.emit('/self/update', {experiences: [{name:''}]});
            socket.on('/self/update/fail', err => {
                console.log(err.name);
                User.findById(initialUser._id).then(user => {                    
                    expect(user.summary).toBe(null);
                    done();
                });                
            });
        });

        it('should return validation error if skills invalid', (done) => {
            socket.emit('/self/update', {skills: ['']});
            socket.on('/self/update/fail', err => {
                console.log(err.name);
                User.findById(initialUser._id).then(user => {                    
                    expect(user.summary).toBe(null);
                    done();
                });                
            });
        });

        it('should update user and broadcast', (done) => {
            socket.emit('/self/update', info);
            client1.on('/user/update', (user) => {
                expect(user.experiences.length).toBe(info.experiences.length);
                expect(user.skills).toMatch(info.skills);
                expect(user.work).toBe(info.work);
                expect(user.profession).toBe(info.profession);
                expect(user.summary).toBe(info.summary);
                expect(user.status).toBe(info.status);
                done();
            });            
        });
    });
}

function getUserByTokenTest() {
    describe('get user by token', () => {
        let initialUser; let socket;

        beforeEach((done) => {
            User.remove({}).then(() => {
                request(server)
                .post('/signup')
                .send(users[0])
                .end((err, res) => {
                    if (err) { throw Error(err); }
                    initialUser = res.body;                               
                    socket = io.connect(url, {
                        'query': 'token=' + res.headers['x-auth'] + '&userId=' + initialUser._id
                    });       
                    socket.on('connect', () => done());                    
                });
            }); 
        });
        afterEach((done) => {
            socket.disconnect();
            done();
        });

        it('should return a valid user', (done) => {
            socket.emit('/self/getByToken');
            socket.on('/self/getByToken/success', res => {
                console.log(res);
                expect(res._id).toBe(initialUser._id);
                User.findById(initialUser._id).then(user => {                    
                    expect(user._id + '').toBe(initialUser._id);                    
                    done();
                });                
            });
        });
    });
}

function getUserByIdTest() {
    describe('get user by id', () => {
        let initialUser; let socket;

        beforeEach((done) => {
            User.remove({}).then(() => {
                request(server)
                .post('/signup')
                .send(users[0])
                .end((err, res) => {
                    if (err) { throw Error(err); }
                    initialUser = res.body;                               
                    socket = io.connect(url, {
                        'query': 'token=' + res.headers['x-auth'] + '&userId=' + initialUser._id
                    });       
                    socket.on('connect', () => done());                    
                });
            }); 
        });
        afterEach((done) => {
            socket.disconnect();
            done();
        });

        it('should return a valid user', (done) => {
            socket.emit('/user/getById', initialUser._id);
            socket.on('/user/getById/success', res => {
                expect(res._id).toBe(initialUser._id);
                User.findById(initialUser._id).then(user => {                    
                    expect(user._id + '').toBe(initialUser._id);                    
                    done();
                });                
            });
        });

        it('should return error if token invalid', (done) => {
            socket.emit('/user/getById', 'nonvalidid');
            socket.on('/user/getById/fail', () => {                
                User.findById(initialUser._id).then(user => {                    
                    expect(user._id + '').toBe(initialUser._id);                    
                    done();
                });      
            });
        });
    });
}

module.exports = {
    updateTest,
    getUserByTokenTest,
    getUserByIdTest
};