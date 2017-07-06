const {User} = require('../models/user');
const {Message} = require('../models/message');

function getContacts(socket) {
    socket.on('/self/getContacts', () => {        
        User.findOne(
            {_id: socket.userId},
            {contacts: 1, blocked: 1}
        ).then(user => {            
            if (!user) {                
                socket.emit('/criticalError', 'no user');
            }            
            User.find({                
                    _id: {$in: user.contacts, $nin: user.blocked},
                    blocked: { $ne: socket.userId },
                }, 
                {contacts: 0, blocked: 0, chatrooms: 0, chats: 0, authType:0, password: 0, token: 0}
            ).sort(
                {'name.first': 1}
            ).then(contacts => {                    
                if (contacts) {                           
                    socket.emit('/self/getContacts/success', contacts);
                }
            });

        }).catch(err => {
            socket.emit('/self/getChats/fail', err);
        });
    });
}

function deleteContact(socket) {
    socket.on('/self/deleteContact', userToDeleteId => {
        User.findOneAndUpdate(
            {_id: socket.userId},
            {$pull: {contacts: userToDeleteId}}
        ).then(() => {
            socket.emit('/self/deleteContact/success', userToDeleteId);            
        }).catch(err => {
            socket.emit('/self/deleteContact/fail', err);
        });
    });
}

function addContact(socket) {
    socket.on('/self/addContact', userToAddId => {
        const chatroomId = createChatroomId(socket.userId + '', userToAddId);                
        Message.count({chatroomId}).then(count => {            
            if (count >= 2) {
                return User.update(
                    { _id: socket.userId },
                    { $addToSet: { contacts: userToAddId } }
                ).then(() => {
                    findUser(userToAddId);
                });
            } else {
                throw Error('no approval from other person');
            }
        }).catch(err => {
            socket.emit('/self/addContact/fail', err);
        });
    });

    function findUser(_id) {
        User.findOne(
            {_id},            
            {contacts: 0, blocked: 0, chatrooms: 0, chats: 0, authType:0, password: 0, token: 0}
        ).then(user => {
            socket.emit('/self/addContact/success', user);
        });
    }

    function createChatroomId(id1, id2) { 
        const compare = id1.localeCompare(id2);    
        if (compare === -1) {
            return id1 + id2;
        } else {
            return id2 + id1;
        }    
    }
}

module.exports = {
    getContacts,
    deleteContact,
    addContact
};