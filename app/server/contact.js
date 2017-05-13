const {User} = require('../models/user');

function getContacts(socket) {
    socket.on('/user/getContacts', () => {
        User.find({_id: socket.userId}).then(user => {
            if (!user) {
                Promise.reject();
            }

            User.find({
                _id: {$in: user.contacts}
            }).then(contacts => {
                if (contacts) {
                    socket.emit('/user/getChats/success', contacts);
                }
            });

        }).catch(err => {
            socket.emit('/user/getChats/fail', err);
        });
    });
}

function deleteContact(socket) {
    function notifyUsersOfDeletedContact(deletedUserId) {
        socket.emit('/self/deleteContact/success', deletedUserId);
        socket.to(deletedUserId).emit('/contact/deletedBy', socket.userId);
    }

    function deleteUserFromContacts(userToDeleteId) {
        User.findOneAndUpdate(
            {_id: socket.userId},
            {$pull: {contacts: userToDeleteId}}
        ).then(() => {
            User.findOneAndUpdate(
                {_id: userToDeleteId},
                {$pull: {contacts: socket.userId}}
            ).then(() => {
                notifyUsersOfDeletedContact(userToDeleteId);
            }).catch(err => {
                Promise.reject(err);
            });
        }).catch(err => {
            socket.emit('/self/deleteContact/fail', err);
        });
    }
    socket.on('/self/deleteContact', userToDeleteId => {
        deleteUserFromContacts(userToDeleteId);
    });
}

module.exports = {
    getContacts,
    deleteContact
};