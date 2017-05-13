const expect = require('expect');
const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');

function signupTest() {
    describe('signup', () => {
        it('should create a new user return auth token', (done) => {
            const age = 31;
            const name = {first: 'first', last: 'last'};
            const email = 'TestUser@email.com';
            const password = 'somepw123';

            request(server)
                .post('/signup')
                .send({age, name, email, password})
                .expect(200)
                .expect((res) => {                                   
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(email);
                    expect(res.body.password).toNotBe(password);
                })
                .end((err) => {
                    if (err) {
                        return done(err);
                    }                    
                    User.findOne({email}).then((user) => {                        
                        expect(user).toExist();
                        expect(user.password).toNotBe(password);
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                });
        });

        it('should create a new user and broadcast', (done) => {

        });

        it('should not create user if email in use', (done) => {

        });

        it ('should return validation error if request invalid', (done) => {

        });
    });
}

function loginTest() {
    describe('login', () => {
        it ('should login user and return auth token', (done) => {

        });

        it ('should login user and broadcast', (done) => {

        });

        it('should reject invalid login', (done) => {

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