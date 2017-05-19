const expect = require('expect');
const request = require('supertest');
const {server} = require('../index');
const {User} = require('../models/user');
const {users, completeUsers, url, exampleToken, signupUserAndGetSocket} = require('./seed');
const io = require('socket.io-client');

function getNetworkTest() {
    //Saint Marks Place
    const saintMarks = [-73.98767179999999,40.7285977];
    //Columbia University. 9km away from client 1
    const columbia = [-73.96257270000001, 40.8075355];
    //Brooklyn Museum. 15.1km away from client2. 6.6km away from client1
    const brooklynMuseum = [-73.963631, 40.671206];
    describe('get network', () => {
        let client1; let client2; let client3; let user1; let user2; let user3;

        beforeEach(done => {      
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
            client1.emit('/self/updateLocation', saintMarks);            
            client2.emit('/self/updateLocation', columbia);            
            client3.emit('/self/updateLocation', brooklynMuseum);
            let doneCount = 0;
            function doneAfter() {
                doneCount++;
                if (doneCount === 3) { done(); }
            }
            client3.on('/self/updateLocation/success', doneAfter);
            client2.on('/self/updateLocation/success', doneAfter);                                    
            client1.on('/self/updateLocation/success', doneAfter);                                  
        });     
        afterEach(done => {
            client1.disconnect();
            client2.disconnect();
            client3.disconnect();
            let doneCount = 0;
            function doneAfter() {
                doneCount++;
                if (doneCount === 3) { server.close(); done(); }
            }
            client3.on('disconnected', doneAfter);
            client2.on('disconnected', doneAfter);                                    
            client1.on('disconnected', doneAfter);                                              
            done();            
        });

        it('should update location correctly', done => {            
            const update = [-73.98767189999999, 40.7285977];
            client1.emit('/self/updateLocation', update);
            client1.on('/self/updateLocation/success', loc => {
                expect(loc[0]).toBe(update[0]);
                expect(loc[1]).toBe(update[1]);                
                done();
            });
        });

        it('should update location correctly and broadcast to right users', done => {            
            const update = [-73.98767179999999, 40.7285977];
            client1.emit('/self/updateLocation', update);
            let doneCount = 0;
            function doneAfter() {
                doneCount++;
                if (doneCount === 2) { done(); }
            }
            client3.on('/user/updateLocation', user => {             
                expect(user._id + '').toBe(user1._id + '');
                expect(user.loc[0]).toBe(update[0]);
                expect(user.loc[1]).toBe(update[1]);                
                doneAfter();         
            });
            client2.on('/user/updateLocation', user => {             
                expect(user._id + '').toBe(user1._id + '');
                expect(user.loc[0]).toBe(update[0]);
                expect(user.loc[1]).toBe(update[1]);                
                doneAfter();        
            });
        });

        it('should update location correctly and broadcast', done => {                        
            const update = [-73.98767179999999, 40.7285977];
            client2.emit('/self/updateLocation', update);
            client1.on('/user/updateLocation', user => {                             
                expect(user._id + '').toBe(user2._id + '');
                expect(user.loc[0]).toBe(update[0]);
                expect(user.loc[1]).toBe(update[1]);                
                done();        
            });
            client3.on('/user/updateLocation', user => {
                throw Error(user);
            });
        });

        // it('should return users in 10km radius', done => {
        //     done();
        // });

        // it('should not return blocked user', done => {
        //     done();
        // });

        // it('should not return user who blocked self', done => {
        //     done();
        // });

        // it('should broadcast user after signup', done => {
        //     done();
        // });

        // it('should broadcast user after login', done => {
        //     done();
        // });

    });
}

module.exports = {
    getNetworkTest
};