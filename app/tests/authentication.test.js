const expect = require('expect');
const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');
const {users} = require('./seed');

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

        it('should return validation error if request invalid', (done) => {
            const mock = users[0];
            request(server)
            .post('/signup')
            .send({age: 1, email: mock.email, password: mock.password, name: mock.name})
            .expect(400)
            .end(done);
        });

        it('should create a new user and broadcast', (done) => {
            done();
        });
    });
}

function loginTest() {
    describe('login', () => {
        it ('should login user and return auth token', (done) => {
            done();
        });

        it('should reject invalid login', (done) => {
            done();
        });

        it ('should login user and broadcast', (done) => {
            done();
        });
    });
}

function socketConnectTest() {
    const url = 'http://localhost:3000';

    describe('connect to socket', () => {
        it ('should connect to socket with a valid auth token', (done) => {
            
        });

        it ('should not connect to socket without an invalid auth token', (done) => {

        });
    });
}

module.exports = {
    signupTest,
    loginTest,
    socketConnectTest
};