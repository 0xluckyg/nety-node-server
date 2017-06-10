const request = require('supertest');
const {server} = require('../index');
const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTFhMTlmNDNiNWIyNjI2YTViMTEyMTQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDk0ODgyODA1fQ.Zz4XZw0qslzNcW2oQhIYWJCkyODi_Rm5wef-qExi8n4'
const url = 'http://localhost:3000';
const io = require('socket.io-client');

const users = [
    {
        age: 20,
        name: {first: 'first', last: 'last1'},
        email: 'TestUser1@email.com',
        password: 'somepw123'
    },
    {
        age: 30,
        name: {first: 'second', last: 'last2'},
        email: 'TestUser2@email.com',
        password: 'somepw123'
    },
    {
        age: 40,
        name: {first: 'third', last: 'last3'},
        email: 'TestUser3@email.com',
        password: 'somepw123'
    },
    {
        age: 20,
        name: {first: 'fourth', last: 'last4'},
        email: 'TestUser4@email.com',
        password: 'somepw123'
    },
    {
        age: 30,
        name: {first: 'fifth', last: 'last5'},
        email: 'TestUser5@email.com',
        password: 'somepw123'
    },
    {
        age: 40,
        name: {first: 'sixth', last: 'last6'},
        email: 'TestUser6@email.com',
        password: 'somepw123'
    },
    {
        age: 40,
        name: {first: 'seventh', last: 'last7'},
        email: 'TestUser7@email.com',
        password: 'somepw123'
    },
    {
        age: 40,
        name: {first: 'eighth', last: 'last8'},
        email: 'TestUser8@email.com',
        password: 'somepw123'
    },
    {
        age: 40,
        name: {first: 'nineth', last: 'last9'},
        email: 'TestUser9@email.com',
        password: 'somepw123'
    },
    {
        age: 40,
        name: {first: 'tenth', last: 'last10'},
        email: 'TestUser10@email.com',
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

const messages = [
    {
        chatroomId: null,
        senderId: null,
        toId: null,
        text: 'Test message 1'
    },
    {
        chatroomId: null,
        senderId: null,
        toId: null,
        text: 'Test message 2'
    },
    {
        chatroomId: null,
        senderId: null,
        toId: null,
        text: 'Test message 3'
    },
    {
        chatroomId: null,
        senderId: null,
        toId: null,
        text: 'Test message 4'
    },
    {
        chatroomId: null,
        senderId: null,
        toId: null,
        text: 'Test message 5'
    },
    {
        chatroomId: null,
        senderId: null,
        toId: null,
        text: 'Test message 6'
    },
    {
        chatroomId: null,
        senderId: null,
        toId: null,
        text: 'Test message 7'
    },
]

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
    messages,
    completeUsers,
    exampleToken,
    url,
    signupUserAndGetSocket
};