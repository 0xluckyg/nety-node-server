const expect = require('expect');
const io = require('socket.io-client');

const {ObjectID} = require('mongodb');

const port = 'http://localhost:3000';

describe('signup', () => {
    it('should create a new user return auth token', (done) => {

    });

    it('should create a new user and broadcast', (done) => {

    });

    it('should not create user if email in use', (done) => {

    });

    it ('should return validation error if request invalid', (done) => {

    });
});

describe('login', () => {
    it ('should login user and return auth token', (done) => {

    });

    it ('should login user and broadcast', (done) => {

    });

    it('should reject invalid login', (done) => {

    });
});

describe('connect to socket', () => {
    it ('should connect to socket with a valid auth token', (done) => {

    });

    it ('should not connect to socket without an invalid auth token', (done) => {

    });
});

describe('update', () => {
    it ('should update user and broadcast', (done) => {

    });

    it ('should update user and notify self', (done) => {

    });

    it ('should return validation error if request invalid', (done) => {

    });
});

describe('logout', () => {
    it ('should logout user and delete auth token', (done) => {

    });
})

describe('get user by token', () => {
    it ('should return a valid user', (done) => {

    });

    it ('should return error if token invalid', (done) => {

    });
})

describe('get user by id', () => {
    it ('should return a valid user', (done) => {

    });

    it ('should return error if id invalid', (done) => {

    });
})

describe('get network', () => {
    it ('should return users in 10km radius', (done) => {

    });

    it ('should not return blocked user', (done) => {

    });

    it ('should not return user who blocked self', (done) => {

    })
});

describe('get chatrooms', () => {
    it ('should return chatrooms', (done) => {

    });

    it ('should not return blocked user', (done) => {

    });

    it ('should not return user who blocked self', (done) => {

    })
});

describe('get contacts', () => {
    it ('should return contacts', (done) => {

    });

    it ('should not return blocked user', (done) => {

    });

    it ('should not return user who blocked self', (done) => {

    })
});

describe('delete chat', () => {
    it ('should delete chat and notify self', (done) => {

    });
});

describe('delete contact', () => {
    it ('should delete contact and notify self', (done) => {

    });

    it ('should delete contact and notify other user', (done) => {

    });

    it ('should delete contact and delete all corresponding messages', (done) => {

    });
});

describe('block user', () => {
    it ('should block user and notify self', (done) => {

    });

    it ('should block user and notify other user', (done) => {

    });
});

describe('unblock user', () => {
    it ('should unblock user and notify self', (done) => {

    });

    it ('should unblock user and notify other user', (done) => {

    });
});

describe('change descovery setting', () => {
    it ('should change descovery setting and notify self', (done) => {

    });

    it ('should change descovery setting and broadcast', (done) => {

    });
});

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
