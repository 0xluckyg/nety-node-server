const expect = require('expect');
const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');
const {users, completeUsers, url} = require('./seed');
const io = require('socket.io-client');
const _ = require('lodash');

function signupTest() {

    describe('signup', () => {        
        beforeEach((done) => {            
            User.remove({}).then(() => {
                request(server)
                .post('/signup')
                .send(users[0])
                .end((done));
            });    
        });

        it('should create a new user return auth token', (done) => {            
            const mock = users[1];
            request(server)
            .post('/signup')
            .send(mock)
            .expect(200)
            .expect((res) => {                                   
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(mock.email);                
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }                    
                User.findOne({email:mock.email}).then((user) => {                        
                    expect(user).toExist();
                    expect(user.password).toNotBe(mock.password);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        });

        it('should not create user if email in use', (done) => {
            const mock = users[0];
            request(server)
            .post('/signup')
            .send(mock)
            .expect(400)
            .end(done);
        });        

        it('should return validation error if name invalid', (done) => {
            const mock = users[1];
            request(server)
            .post('/signup')
            .send({                
                email: mock.email, 
                password: mock.password, 
                name: {first: 'abcdefghijklmnopqrstuvwxyz', last: 'b'}})
            .expect(400)
            .end(done);
        });

        it('should return validation error if email invalid', (done) => {
            const mock = users[1];
            request(server)
            .post('/signup')
            .send({email: "aoweijogij", password: mock.password, name: mock.name})
            .expect(400)
            .end(done);
        });       
    });
}

function loginTest() {
    const info = _.pick(completeUsers[0], ['status', 'summary', 'profession', 'work', 'skills', 'experiences']);
    describe('login', () => {
        beforeEach((done) => {    
            const mock = completeUsers[0];            
            User.remove({}).then(() => {
                request(server)
                .post('/signup')
                .send({email: mock.email, password: mock.password, name: mock.name})
                .end((err, res) => {                    
                    User.update({_id: res.body._id}, info).then(() => done());                    
                });
            });
        });

        it('should login user and return auth token', (done) => {
            const mock = users[0];
            request(server)
            .post('/login')
            .send({email: mock.email, password: mock.password})
            .expect(200)
            .end((err, res) => {                                        
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(mock.email);                    
                done();
            });
        });

        it('should reject invalid password', (done) => {
            const mock = users[0];
            request(server)
            .post('/login')
            .send({email: mock.email, password: 'invalidpassword'})
            .expect(400)
            .end(done);
        });

        it('should reject invalid email', (done) => {
            const mock = users[0];
            request(server)
            .post('/login')
            .send({ email: 'invalidemail@gmail.com', password: mock.password })
            .expect(400)
            .end(done);
        });

         it('should return full user after login', (done) => {
            const mock = users[0];
            request(server)
            .post('/login')
            .send({ email: mock.email, password: mock.password })
            .expect(200)
            .end((err, res) => {                
                expect(res.body.experiences.length).toBe(info.experiences.length);
                expect(res.body.skills).toMatch(info.skills);
                expect(res.body.work).toBe(info.work);
                expect(res.body.profession).toBe(info.profession);
                expect(res.body.summary).toBe(info.summary);
                expect(res.body.status).toBe(info.status);
                done();
            });            
        });
    });
}

function socketConnectTest() {
    describe('connect to socket', () => {
        beforeEach(done => {
            User.remove({}).then(() => {
                request(server)
                .post('/signup')
                .send(users[0])
                .end((done));
            });    
        });

        it('should create a new user and connect with valid token', (done) => {
            const mock = users[1];            
            request(server)
            .post('/signup')
            .send(mock)
            .expect(200)
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

        it('should not connect to socket with an invalid auth token', (done) => {            
            const socket = io.connect(url, {
                    'query': 'token=' + 'invalidToken'
                });
            socket.on('connect', () => {                                           
                throw Error("shouldn't have connected");
            }); 

            setTimeout(() => {
                done();
            }, 500);
        });

        it('should not connect to socket without token', (done) => {            
            const socket = io.connect(url);                
            socket.on('connect', () => {                                           
                throw Error("shouldn't have connected");
            }); 

            setTimeout(() => {
                done();
            }, 500);
        });
    });
}

module.exports = {
    signupTest,
    loginTest,
    socketConnectTest
};