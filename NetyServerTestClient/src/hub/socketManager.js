import SocketIOClient from 'socket.io-client';
import _ from 'lodash';
import * as keys from '../global/keys';

let socket;

const socketManager = {
    connect: function(token) {
        socket = SocketIOClient(keys.SERVER, {
            'query': 'token=' + token
        });

        socket.on('connect', () => {
            console.log('it connected')
        })

        socket.on('disconnect', () => {
            console.log('it disconnected')
        })
    },
    logout: function(token) {
        if (socket) {
            socket.emit('user.logout', {token})
        }

        socket.on('user.logout.success', () => {
            console.log('user logged out!');
        })

        socket.on('user.logout.fail', () => {
            console.log('logout failed');
        })
    }
}

export default socketManager;
