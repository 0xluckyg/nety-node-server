const {User} = require('../models/user');

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
            }).sort(
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

module.exports = {
    getContacts,
    deleteContact
};