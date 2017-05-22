const expect = require('expect');
const {ObjectId} = require('mongodb');
const {User} = require('../models/user');
const {users, signupUserAndGetSocket} = require('./seed');

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
        it('should delete contact and notify self', (done) => {

        });

        it('should delete contact and notify other user', (done) => {

        });

        it('should delete contact and delete all corresponding messages', (done) => {

        });
    });
}

module.exports = {
    getContactsTest,
    deleteContactTest
};