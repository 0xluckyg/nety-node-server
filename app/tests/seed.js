const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');
const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTFhMTlmNDNiNWIyNjI2YTViMTEyMTQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDk0ODgyODA1fQ.Zz4XZw0qslzNcW2oQhIYWJCkyODi_Rm5wef-qExi8n4'
const url = 'http://localhost:3000';
const io = require('socket.io-client');

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

const completeUsers = [
    {
        age: 20,
        name: {first: 'first1', last: 'last1'},
        email: 'TestUser1@email.com',
        password: 'somepw123',
        status: 'test user 1 status',
        summary: 'test user 1 summary',
        profession: 'test user 1 profession',
        work: 'test user 1 work',
        skills: ['test user 1 skills'],
        experiences: [
            {
                name: 'test user 1 exp1 name',
                start: new Date(),
                end: new Date(),
                description: 'test user 1 exp1 description',
            },
            {
                name: 'test user 1 exp2 name',
                start: new Date(),
                end: new Date(),
                description: 'test user 1 exp2 description',
            }
        ]
    },
    {
        age: 30,
        name: {first: 'first2', last: 'last2'},
        email: 'TestUser2@email.com',
        password: 'somepw123',
        status: 'test user 2 status',
        summary: 'test user 2 summary',
        profession: 'test user 2 profession',
        work: 'test user 2 work',
        skills: ['test user 2 skills'],
        experiences: [
            {
                name: 'test user 2 exp1 name',
                start: new Date(),
                end: new Date(),
                description: 'test user 2 exp1 description',
            },
            {
                name: 'test user 2 exp2 name',
                start: new Date(),
                end: new Date(),
                description: 'test user 2 exp2 description',
            }
        ]
    }
];

function signupUserAndGetSocket(user, callback) {    
    request(server)
    .post('/signup')
    .send(user)
    .end((err, res) => {        
        if (err) { throw Error(err); }                   
        const socket = io.connect(url, {
            'query': 'token=' + res.headers['x-auth'] + '&userId=' + res.body._id
        });
        socket.on('connect', () => callback(socket, res.body));
    });
}

module.exports = {
    users,
    completeUsers,
    exampleToken,
    url,

    signupUserAndGetSocket
};