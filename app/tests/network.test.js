const expect = require('expect');
const {User} = require('../models/user');
const {users, signupUserAndGetSocket} = require('./seed');

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
            done();
        });

        it('should return users in max radius', done => {
            client1.emit('/self/getNetwork', saintMarks);
            client1.on('/self/getNetwork/success', users => {
                expect(users.length).toBe(2);
                done();
            });            
        });

        it('should not return users outside max radius', done => {
            client2.emit('/self/getNetwork', columbia);
            client2.on('/self/getNetwork/success', users => {
                expect(users.length).toBe(1);
                expect(users[0]._id).toBe(user1._id);
                done();
            });            
        });
        
        it('should not return user I blocked', done => {
            client1.emit('/self/blockUser', user2._id);
            client1.on('/self/blockUser/success', () => {                
                client1.emit('/self/getNetwork', saintMarks);
                client1.on('/self/getNetwork/success', users => {
                    expect(users.length).toBe(1);
                    expect(users[0]._id).toBe(user3._id);
                    done();
                });                
            });            
        });

        it('should not return user who blocked me', done => {
            client2.emit('/self/blockUser', user1._id);
            client2.on('/self/blockUser/success', () => {
                client1.emit('/self/getNetwork', saintMarks);
                client1.on('/self/getNetwork/success', users => {                    
                    expect(users.length).toBe(1);
                    expect(users[0]._id).toBe(user3._id);
                    done();
                });
            });            
        });

        it('should not return user who set discovery settings off', done => {
            client3.emit('/self/changeDiscoverable', false);
            client3.on('/self/changeDiscoverable/success', () => {
                client1.emit('/self/getNetwork', saintMarks);
                client1.on('/self/getNetwork/success', users => {                    
                    expect(users.length).toBe(1);
                    expect(users[0]._id).toBe(user2._id);
                    done();
                });
            });
        });

    });
}

function updateNetworkTest() {
        //Saint Marks Place
    const saintMarks = [-73.98767179999999,40.7285977];
    //Columbia University. 9km away from client 1
    const columbia = [-73.96257270000001, 40.8075355];
    //Brooklyn Museum. 15.1km away from client2. 6.6km away from client1
    const brooklynMuseum = [-73.963631, 40.671206];
    describe('update network', () => {
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

        it('should update location correctly and broadcast to people within max radius', done => {            
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

        it('should update location correctly and not broadcast to people outside max radius', done => {                        
            const update = [-73.98767179999999, 40.7285977];
            client2.emit('/self/updateLocation', update);
            client3.on('/user/updateLocation', user => {
                throw Error(user);
            });
            client1.on('/user/updateLocation', user => {                             
                expect(user._id + '').toBe(user2._id + '');
                expect(user.loc[0]).toBe(update[0]);
                expect(user.loc[1]).toBe(update[1]);                
                done();        
            });            
        });

        it('should update location and not notify user I blocked', done => {
            const update = [-73.98767179999999, 40.7285977];
            client1.emit('/self/blockUser', user2._id);
            client1.on('/self/blockUser/success', () => {                
                client1.emit('/self/updateLocation', update);
                client2.on('/user/updateLocation', user => {
                    throw Error(user);
                });                
                client3.on('/user/updateLocation', user => {
                    expect(user._id + '').toBe(user1._id + '');
                    expect(user.loc[0]).toBe(update[0]);
                    expect(user.loc[1]).toBe(update[1]);
                    done();
                });                      
            });            
        });

        it('should update location and not notify user who blocked me', done => {
            const update = [-73.98767179999999, 40.7285977];
            client3.emit('/self/blockUser', user1._id);
            client3.on('/self/blockUser/success', () => {
                client1.emit('/self/updateLocation', update);
                client3.on('/user/updateLocation', user => {
                    throw Error(user);
                });                
                client2.on('/user/updateLocation', user => {
                    expect(user._id + '').toBe(user1._id + '');
                    expect(user.loc[0]).toBe(update[0]);
                    expect(user.loc[1]).toBe(update[1]);
                    done();
                });
            });       
        });

        it('should update location should notify user who set discovery settings off', done => {
            const update = [-73.98767179999999, 40.7285977];
            client3.emit('/self/changeDiscoverable', false);
            client3.on('/self/changeDiscoverable/success', () => {
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
        });
    });
}

module.exports = {
    getNetworkTest,
    updateNetworkTest
};