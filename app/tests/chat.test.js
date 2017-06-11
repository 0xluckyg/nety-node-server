const expect = require('expect');
const {ObjectId} = require('mongodb');
const {User} = require('../models/user');
const {Message} = require('../models/message');
const {Chatroom} = require('../models/chatroom');
const {users, signupUserAndGetSocket, messages} = require('./seed');
const _ = require('lodash');

function createChatroomId(id1, id2) {    
    const compare = id1.localeCompare(id2);    
    if (compare === -1) {
        return id1 + id2;
    } else {
        return id2 + id1;
    }    
}

function sendMessageTest() {

    describe('send message', () => {
        let client1; let client2; let user1; let user2;

        beforeEach(done => {
            User.remove({}).then(() => {
                signupUserAndGetSocket(users[0], (socket, user) => {
                    client1 = socket;
                    user1 = user;
                    signupUserAndGetSocket(users[1], (socket, user) => {
                        client2 = socket;
                        user2 = user;                        
                        done();
                    });                 
                });
            });              
        });

        it('should save message and notify self', (done) => {            
            const msg = messages[0];
            msg.senderId = user1._id;
            msg.toId = user2._id;
            msg.chatroomId = createChatroomId(msg.senderId, msg.toId);            
            client1.emit('/self/sendMessage', msg);
            client1.on('/self/sendMessage/success', sentMsg => {
                Message.findById(sentMsg._id).then(returnMsg => {
                    expect(returnMsg).toExist();
                    expect(returnMsg.senderId + '').toBe(user1._id);
                    expect(returnMsg.text).toBe(messages[0].text);
                    Chatroom.findById(msg.chatroomId).then(returnChatroom => {
                        expect(returnChatroom).toExist();
                        expect(returnChatroom.lastMessage.sender + '').toBe(user1._id);
                        expect(returnChatroom.lastMessage.text + '').toBe(messages[0].text);
                        const index = _.findIndex(returnChatroom.users, {userId: new ObjectId(user1._id)});                                                
                        expect(index).toNotBe(-1);                          
                        expect(returnChatroom.users[index].userId + '').toBe(user1._id);
                        expect(returnChatroom.users[index].unread).toBe(0);
                        expect(returnChatroom.users[~index*-1].userId + '').toBe(user2._id);
                        expect(returnChatroom.users[~index*-1].unread).toBe(1);
                        done();
                    });                    
                });                
            });          
        });

        it('should save message and notify other user', (done) => {
            const msg = messages[0];
            msg.senderId = user1._id;
            msg.toId = user2._id;
            msg.chatroomId = createChatroomId(msg.senderId, msg.toId);            
            client1.emit('/self/sendMessage', msg);
            client2.on('/user/message', returnMsg => {
                expect(returnMsg.senderId + '').toBe(user1._id);
                expect(returnMsg.text).toBe(messages[0].text);
                done();
            });
        });        

        it('should send second message successfully', (done) => {
            const msg = messages[0];
            msg.senderId = user1._id;
            msg.toId = user2._id;
            msg.chatroomId = createChatroomId(msg.senderId, msg.toId);            
            client1.emit('/self/sendMessage', msg);
            client2.on('/user/message', returnMsg => {
                expect(returnMsg.senderId + '').toBe(user1._id);
                expect(returnMsg.text).toBe(messages[0].text);                                
                const msg2 = messages[1];
                msg2.senderId = user2._id;
                msg2.toId = user1._id;
                msg2.chatroomId = createChatroomId(msg.senderId, msg.toId);
                client2.emit('/self/sendMessage', msg2);
                client1.on('/user/message', returnMsg2 => {
                    expect(returnMsg2.senderId + '').toBe(user2._id);
                    expect(returnMsg2.text).toBe(messages[1].text);
                    Chatroom.findById(msg2.chatroomId).then(returnChatroom => {
                        expect(returnChatroom).toExist();
                        expect(returnChatroom.lastMessage.sender + '').toBe(user2._id);
                        expect(returnChatroom.lastMessage.text + '').toBe(messages[1].text);
                        const index = _.findIndex(returnChatroom.users, {userId: new ObjectId(user1._id)});                                                
                        expect(index).toNotBe(-1);                          
                        expect(returnChatroom.users[index].userId + '').toBe(user1._id);
                        expect(returnChatroom.users[index].unread).toBe(1);
                        expect(returnChatroom.users[~index*-1].userId + '').toBe(user2._id);
                        expect(returnChatroom.users[~index*-1].unread).toBe(1);
                        done();
                    });                    
                });                
            });
        });

        it('should not send msg with missing chatroomId', (done) => {
            const msg = messages[0];
            msg.senderId = user1._id;
            msg.toId = user2._id;            
            client1.emit('/self/sendMessage', msg);
            client1.on('/self/sendMessage/fail', () => {
                done();
            });
        });

        it('should not send msg with missing text', (done) => {
            const msg = {};
            msg.senderId = user1._id;
            msg.toId = user2._id;        
            msg.chatroomId = createChatroomId(msg.senderId, msg.toId);                          
            msg.text = '';
            client1.emit('/self/sendMessage', msg);
            client1.on('/self/sendMessage/fail', () => {
                done();
            });
        });

        it('should not send msg with missing toId', (done) => {
            const msg = {};
            msg.senderId = user1._id;  
            msg.chatroomId = createChatroomId(user1._id, user2._id);                                                     
            msg.text = 'hmm';
            client1.emit('/self/sendMessage', msg);
            client1.on('/self/sendMessage/fail', () => {
                done();
            });
        });
    });
}

function getMessagesTest() {

}

function readMessageTest() {

    describe('read message', () => {
        let client1; let client2; let user1; let user2;
        beforeEach(done => {
            User.remove({}).then(() => {
                signupUserAndGetSocket(users[0], (socket, user) => {
                    client1 = socket;
                    user1 = user;
                    signupUserAndGetSocket(users[1], (socket, user) => {
                        client2 = socket;
                        user2 = user;                        
                        done();
                    });                 
                });
            });              
        });

        it('should successfully unread message', done => {
            const msg = messages[0];
            msg.senderId = user1._id;
            msg.toId = user2._id;
            msg.chatroomId = createChatroomId(msg.senderId, msg.toId); 
            client1.emit('/self/sendMessage', msg);
            client1.on('/self/sendMessage/success', () => {                
                Chatroom.findById(msg.chatroomId).then(returnChatroom => {                    
                    expect(returnChatroom).toExist();                    
                    const index = _.findIndex(returnChatroom.users, {userId: new ObjectId(user2._id)});                                                
                    expect(index).toNotBe(-1);  
                    expect(returnChatroom.users[index].userId + '').toBe(user2._id);
                    expect(returnChatroom.users[index].unread).toBe(1);                    
                    client2.emit('/self/readMessage', msg.chatroomId);
                    client2.on('/self/readMessage/success', () => {                              
                        Chatroom.findById(msg.chatroomId).then(returnChatroom2 => {
                            expect(returnChatroom2).toExist();
                            const index = _.findIndex(returnChatroom2.users, {userId: new ObjectId(user2._id)});
                            expect(returnChatroom2.users[index].userId + '').toBe(user2._id);
                            expect(returnChatroom2.users[index].unread).toBe(0);
                            done();
                        });                  
                    });   
                });           
            });  
        });  

        it('should fail if chatroom doesn not exist', done => {
            const msg = messages[0];            
            const chatroomId = createChatroomId(user1._id, user2._id); 
            client2.emit('/self/readMessage', msg.chatroomId);
            client2.on('/self/readMessage/fail', () => {                              
                Chatroom.findById(chatroomId).then(returnChatroom2 => {
                    expect(returnChatroom2).toNotExist();                    
                    done();
                });                  
            }); 
        });  
    });

}

function deleteChatTest() {
    describe('delete chat', () => {
        let client1; let client2; let user1; let user2;
        beforeEach(done => {
            User.remove({}).then(() => {
                signupUserAndGetSocket(users[0], (socket, user) => {
                    client1 = socket;
                    user1 = user;
                    signupUserAndGetSocket(users[1], (socket, user) => {
                        client2 = socket;
                        user2 = user;                        
                        done();
                    });                 
                });
            });              
        });

        it ('should delete chat and notify self', (done) => {
            
        });
    });
}

function getChatroomsTest() {
    describe('get chatrooms', () => {
        it ('should return chatrooms', (done) => {

        });

        it ('should not return blocked user', (done) => {

        });

        it ('should not return user who blocked self', (done) => {

        })
    });
}

module.exports = {
    sendMessageTest,
    getMessagesTest,
    readMessageTest,
    deleteChatTest,
    getChatroomsTest
};