import SocketIOClient from 'socket.io-client';
import _ from 'lodash';
import * as keys from '../global/keys';

let socket;

const socketManager = {
    connect: function(token, callback) {
        socket = SocketIOClient(keys.SERVER, {
            'query': 'token=' + token
        });

        socket.on('connect', () => {
            console.log('it connected')
            callback();
        })

        socket.on('disconnect', () => {
            console.log('it disconnected')
        })
    },
    logout: function(token, callback) {
        if (socket) {
            socket.emit('/user/logout', token)
        }

        socket.on('/user/logout/success', () => {
            socket.disconnect();
            callback();
        })

        socket.on('/user/logout/fail', (err) => {
            console.log(err);
        })
    },
    getUserByToken: function(token, callback) {
        if (socket) {
            socket.emit('/user/getByToken', token)
        }

        socket.on('/user/getByToken/success', (user) => {
            callback(user)
        })

        socket.on('/user/getByToken/fail', (err) => {
            console.log(err);
        })
    },
    getNetwork: function() {
        if (socket) {
            socket.emit('/user/getNetwork', {id: 'id', loc: 'location'})
        }

        socket.on('/user/getNetwork/success', (users) => {
            console.log(users)
        })

        socket.on('/user/getNetwork/fail', (err) => {
            console.log(err)
        })
    }
}

export default socketManager;
