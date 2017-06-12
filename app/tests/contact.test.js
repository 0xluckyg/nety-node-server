const expect = require('expect');
const {ObjectId} = require('mongodb');
const {User} = require('../models/user');
const {Message} = require('../models/message');
const {users, signupUserAndGetSocket, createChatroomId} = require('./seed');

function getContactsTest() {
    describe('get contacts', () => {
        let client1; let client2; let user1; let user2;
        const clientIds = [];

        beforeEach(done => {      
            User.remove({}).then(() => signupMany());  

            function signupMany() {
                signupUserAndGetSocket(users[0], (socket, user) => {
                    client1 = socket;
                    user1 = user;
                    signupUserAndGetSocket(users[1], (socket, user) => {
                        client2 = socket;
                        user2 = user;
                        signupUserIds(9);
                    });                 
                });
            }   

            function signupUserIds(i) {
                signupUserAndGetSocket(users[i], (socket, user) => {                        
                    clientIds.push(new ObjectId(user._id));                        
                    if (i === 2) {
                        done();
                    } else {
                        signupUserIds(i - 1);
                    }       
                }); 
            }     
        });
        beforeEach(done => {                 
            const contacts1 = clientIds.slice();                                    
            contacts1.push(new ObjectId(user2._id));            
            User.findOneAndUpdate(
                {_id: user1._id},
                {contacts: contacts1},
                {new: true}                
            ).then(() => {                
                const contacts2 = clientIds.slice();
                contacts2.push(new ObjectId(user1._id));
                User.findOneAndUpdate(
                    {_id:user2._id},
                    {contacts: contacts2}
                ).then(() => {
                    done();
                });
            });
        });
        afterEach(done => {
            client1.disconnect();
            client2.disconnect();                        
            done();
        });

        it('should return contacts', (done) => {
            client1.emit('/self/getContacts');
            client1.on('/self/getContacts/success', users => {                
                expect(users.length).toBe(9);
                done();
            });            
        });

        it('returned contacts should be sorted alphabetically', (done) => {
            client1.emit('/self/getContacts');
            client1.on('/self/getContacts/success', users => {                                
                expect(users[0].name.first).toBe('eighth');
                expect(users[1].name.first).toBe('fifth');
                expect(users[2].name.first).toBe('fourth');
                expect(users[3].name.first).toBe('nineth');
                expect(users[4].name.first).toBe('second');
                expect(users[5].name.first).toBe('seventh');
                expect(users[6].name.first).toBe('sixth');
                expect(users[7].name.first).toBe('tenth');
                expect(users[8].name.first).toBe('third');
                done();
            });
        });

        it('should not return user I blocked', (done) => {
            client1.emit('/self/blockUser', user2._id);
            client1.on('/self/blockUser/success', () => {                
                client1.emit('/self/getContacts');
                client1.on('/self/getContacts/success', users => {
                    expect(users.length).toBe(8);
                    for (let i = 0; i < users.length; i ++) {
                        expect(users[i]._id + '').toNotBe(user2._id + '');
                        if (i === users.length - 1) { done(); }
                    }
                });                
            });
        });

        it('should not return user who blocked me', (done) => {
            client2.emit('/self/blockUser', user1._id);
            client2.on('/self/blockUser/success', () => {                
                client1.emit('/self/getContacts');
                client1.on('/self/getContacts/success', users => {
                    expect(users.length).toBe(8);
                    for (let i = 0; i < users.length; i ++) {                                                
                        expect(users[i]._id + '').toNotBe(user2._id + '');
                        if (i === users.length - 1) { done(); }
                    }
                });                
            });
        });
    });
}

function deleteContactTest() {
    describe('delete contact', () => {
        let client1; let user1; let user2;
        const clientIds = [];

        beforeEach(done => {      
            User.remove({}).then(() => signupMany());  

            function signupMany() {
                signupUserAndGetSocket(users[0], (socket, user) => {
                    client1 = socket;
                    user1 = user;
                    signupUserAndGetSocket(users[1], (socket, user) => {
                        clientIds.push(user._id);
                        user2 = user;                         
                        signupUserAndGetSocket(users[2], (socket, user) => {
                            clientIds.push(user._id);                            
                            done();
                        });
                    });                 
                });
            }   
        });
        beforeEach(done => {                             
            User.findOneAndUpdate(
                {_id: user1._id},
                {contacts: clientIds}                        
            ).then(() => {                
                done();
            });
        });
        afterEach(done => {
            client1.disconnect();            
            done();
        });
        
        it('should delete contact and notify self', (done) => {
            client1.emit('/self/deleteContact', user2._id);
            client1.on('/self/deleteContact/success', id => {
                expect(id + '').toBe(user2._id + '');
                User.findById(user1._id).then(user => {
                    expect(user.contacts.length).toBe(1);
                    expect(user.contacts).toNotContain(id + '');
                    done();
                });
            });
        });
    });
}

function addContactTest() {
    describe('add contact', () => {
        let client1; let user1; let user2;

        beforeEach(done => {
            User.remove({}).then(() => {
                signupUserAndGetSocket(users[0], (socket, user) => {
                    client1 = socket;
                    user1 = user;
                    signupUserAndGetSocket(users[1], (socket, user) => {                        
                        user2 = user;     
                        done();                                           
                    });                 
                });
            });              
        }); 

        it('should add to contact if number of messages is greater than 2', (done) => {            
            createMessages(0,2,() => {
                client1.emit('/self/addContact', user2._id);
                client1.on('/self/addContact/success', addedUser => {
                    User.findOne({_id: user1._id}, {contacts: 1}).then(user => {                        
                        expect(user.contacts.length).toBe(1);
                        expect(user.contacts[0] + '').toBe(addedUser + '');
                        done();
                    });
                });
            });
        });     

        it('should not add to contact if number of messages is less than 2', (done) => {
            createMessages(0,0,() => {
                client1.emit('/self/addContact', user2._id);
                client1.on('/self/addContact/fail', () => {
                    User.findOne({_id: user1._id}, {contacts: 1}).then(user => {
                        expect(user.contacts.length).toBe(0);
                        done();
                    });
                });
            });
        });        

        function createMessages(start, end, callback) {
            Message.remove({}).then(() => {
                const messages = [];
                const chatroomId = createChatroomId(user1._id, user2._id);
                for (let i = start; i <= end; i++) {
                    const message = {};
                    message.chatroomId = chatroomId;
                    if (i % 2 === 0) {
                        message.senderId = user1._id;
                    } else {
                        message.senderId = user2._id;
                    }
                    message.text = `Test message ${i}`;
                    messages.push(message);
                }                
                Message.insertMany(messages).then(() => {
                    callback();   
                });  
            });                           
        }  
    });
}

module.exports = {
    getContactsTest,
    deleteContactTest,
    addContactTest
};