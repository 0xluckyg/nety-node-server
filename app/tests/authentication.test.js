const expect = require('expect');
const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');
const {users} = require('./seed');
const io = require('socket.io-client');
const url = 'http://localhost:3000';

function signupTest() {    
    
    describe('signup', () => {
        
        beforeEach((done) => {            
            User.remove({}).then(() => {
                const user = new User(users[0]);
                user.save(() => done());
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
                expect(res.body.password).toNotBe(mock.password);
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

        it('should return validation error if age invalid', (done) => {
            const mock = users[1];
            request(server)
            .post('/signup')
            .send({age: 1, email: mock.email, password: mock.password, name: mock.name})
            .expect(400)
            .end(done);
        });

        it('should return validation error if name invalid', (done) => {
            const mock = users[1];
            request(server)
            .post('/signup')
            .send({
                age: mock.age, 
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
            .send({age: mock.age, email: "aoweijogij", password: mock.password, name: mock.name})
            .expect(400)
            .end(done);
        });       
    });
}

function loginTest() {
    
    beforeEach((done) => {    
        const mock = users[0];
        User.remove({}).then(() => {
            request(server)
            .post('/signup')
            .send(mock)
            .end(done);
        });
    });

    describe('login', () => {
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
    });
}

function socketConnectTest() {
    describe('connect to socket', () => {                

        beforeEach((done) => {            
            User.remove({}).then(() => done());
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
                socket.on('welcome', connected => {                    
                    expect(connected).toBe(true);                                        
                    done();
                });                                
            });
        });

        it('should not connect to socket with an invalid auth token', (done) => {            
            const socket = io.connect(url, {
                    'query': 'token=' + 'invalidToken'
                });
            socket.on('connect', connected => {                                           
                throw Error("shouldn't have connected, ", connected);
            }); 

            setTimeout(() => {
                done();
            }, 500);
        });

        it('should not connect to socket without token', (done) => {            
            const socket = io.connect(url);                
            socket.on('connect', connected => {                                           
                throw Error("shouldn't have connected, ", connected);
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