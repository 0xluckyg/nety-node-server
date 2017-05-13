const {User} = require('../models/user');
const {UserProperty} = require('../models/userProperty');

function getContacts(socket) {
    socket.on('/user/getContacts', () => {
        UserProperty.find({userId: socket.userId}).then(userProperty => {
            if (!userProperty) {
                Promise.reject();
            }

            User.find({
                _id: {$in: userProperty.contacts}
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
        UserProperty.findOneAndUpdate(
            {userId: socket.userId},
            {$pull: {contacts: userToDeleteId}}
        ).then(() => {
            UserProperty.findOneAndUpdate(
                {userId: userToDeleteId},
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