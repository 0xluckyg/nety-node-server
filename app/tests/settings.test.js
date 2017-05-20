const expect = require('expect');
const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');
const {users, completeUsers, url, exampleToken, signupUserAndGetSocket} = require('./seed');
const io = require('socket.io-client');

function logoutTest() {
    //Saint Marks Place
    const saintMarks = [-73.98767179999999,40.7285977];
    //Columbia University. 9km away from client 1
    const columbia = [-73.96257270000001, 40.8075355];
    //Brooklyn Museum. 15.1km away from client2. 6.6km away from client1
    const brooklynMuseum = [-73.963631, 40.671206];
    describe('logout', () => {        
        let client1; let client2; let client3; let user1; let user2; let user3;
        beforeEach((done) => {
            User.remove({}).then(() => signupMany());  
            
            function signupMany() {
                signupUserAndGetSocket(users[0], (socket, user) => {
                    client1 = socket;
                    user1 = user;
                    signupUserAndGetSocket(users[1], (socket, user) => {
                        client2 = socket;
                        user2 = user;
                        signupUserAndGetSocket(users[2], (socket, user) => {
                            client3 = socket;
                            user3 = user;
                            done();
                        }); 
                    }); 
                });
            }
        });
        afterEach(done => {
            client1.disconnect();
            client2.disconnect();
            client3.disconnect();
            done();
        });

        it('should logout user and delete auth token', (done) => {
            client1.emit('/self/logout');
            client1.on('/self/logout/success', () => {                
                User.findById(user1._id).then(user => {
                    expect(user._id + '').toBe(user1._id + '');                    
                    expect(user.token).toBe(undefined);
                    done();
                });
            });
        });

        it('should logout user and broadcast to other users', (done) => {
            client1.emit('/self/updateLocation', saintMarks);
            client1.on('/self/updateLocation/success', () => {
                client2.emit('/self/updateLocation', columbia);
                client2.on('/self/updateLocation/success', () => {
                    client3.emit('/self/updateLocation', brooklynMuseum);
                    client3.on('/self/updateLocation/success', () => {
                        client1.emit('/self/logout');
                        let doneCount = 0;
                        function doneAfter() {
                            doneCount++;
                            if (doneCount === 2) { done(); }
                        }
                        client2.on('/user/loggedOut', id => {                        
                            expect(id + '').toBe(user1._id + '');
                            doneAfter();
                        });
                        client3.on('/user/loggedOut', id => {                        
                            expect(id + '').toBe(user1._id + '');
                            doneAfter();
                        });
                    });                    
                });                
            });                        
        });

        it('should logout user and not broadcast to other users outside max range', (done) => {
            client1.emit('/self/updateLocation', columbia);
            client1.on('/self/updateLocation/success', () => {
                client2.emit('/self/updateLocation', saintMarks);
                client2.on('/self/updateLocation/success', () => {
                    client3.emit('/self/updateLocation', brooklynMuseum);
                    client3.on('/self/updateLocation/success', () => {
                        client1.emit('/self/logout');                        
                        client2.on('/user/loggedOut', id => {                        
                            expect(id + '').toBe(user1._id + '');
                            done();
                        });
                        client3.on('/user/loggedOut', id => {                        
                            throw Error(id);                            
                        });
                    });                    
                });                
            });      
        });
    });
}

function blockTest() {
    describe('block user', () => {
        let client1; let client2; let client3; let user1; let user2; let user3;
        beforeEach((done) => {
            User.remove({}).then(() => signupMany());  
            
            function signupMany() {
                signupUserAndGetSocket(users[0], (socket, user) => {
                    client1 = socket;
                    user1 = user;
                    signupUserAndGetSocket(users[1], (socket, user) => {
                        client2 = socket;
                        user2 = user;
                        signupUserAndGetSocket(users[2], (socket, user) => {
                            client3 = socket;
                            user3 = user;
                            done();
                        });
                    });
                });
            }
        });
        afterEach(done => {
            client1.disconnect();
            client2.disconnect();    
            client3.disconnect();        
            done();
        });

        it('should block user and notify self', (done) => {
            client1.emit('/self/blockUser', user2._id);
            client1.on('/self/blockUser/success', () => {
                User.findById(user1._id).then(user => {
                    expect(user.blocked).toInclude(user2._id);                    
                    done();
                });                
            });            
        });

        it('should block user and notify other user', (done) => {
            client1.emit('/self/blockUser', user2._id);
            client2.on('/user/blocked', uid => {
                User.findById(user1._id).then(user => {
                    expect(user.blocked).toInclude(user2._id);
                    expect(uid +'').toBe(user1._id);
                    done();
                });                
            });
        });

        it('should block user and not notify irrelevant users', (done) => {
            client1.emit('/self/blockUser', user2._id);
            client3.on('/user/blocked', uid => {
                throw Error(uid);
            });
            setTimeout(() => {
                done();
            }, 500);
        });
    });
}

function unblockTest() {
    describe('unblock user', () => {
        let client1; let client2; let client3; let user1; let user2; let user3;
        beforeEach((done) => {
            User.remove({}).then(() => signupMany());  
            
            function signupMany() {
                signupUserAndGetSocket(users[0], (socket, user) => {
                    client1 = socket;
                    user1 = user;
                    signupUserAndGetSocket(users[1], (socket, user) => {
                        client2 = socket;
                        user2 = user;
                        signupUserAndGetSocket(users[2], (socket, user) => {
                            client3 = socket;
                            user3 = user;
                            done();
                        });
                    });
                });
            }
        });
        beforeEach(done => {
            client1.emit('/self/blockUser', user2._id);
            client1.on('/self/blockUser/success', () => {
                done();
            });
        });
        afterEach(done => {
            client1.disconnect();
            client2.disconnect();    
            client3.disconnect();        
            done();
        });
        
        it('should unblock user and notify self', (done) => {
            client1.emit('/self/unblockUser', user2._id);
            client1.on('/self/unblockUser/success', () => {
                User.findById(user1._id).then(user => {
                    expect(user.blocked).toExclude(user2._id);
                    expect(user.blocked.length).toBe(0);
                    done();
                });            
            });
        });

        it('should unblock user and notify other user', (done) => {
            client1.emit('/self/unblockUser', user2._id);
            client2.on('/user/unblocked', uid => {
                expect(uid + '').toBe(user1._id);
                done();                
            });
        });

        it('should unblock user and not notify irrelevant users', (done) => {
            client1.emit('/self/unblockUser', user2._id);
            client3.on('/user/unblocked', uid => {
                throw Error(uid);
            });
            setTimeout(() => {
                done();
            }, 500);
        });
    });
}

function discoverySettingTest() {
    describe('change descovery setting', () => {
        it ('should change descovery setting and notify self', (done) => {

        });

        it ('should change descovery setting and broadcast', (done) => {

        });
    });
}

module.exports = {
    logoutTest,
    blockTest,
    unblockTest,
    discoverySettingTest
};