import SocketIOClient from 'socket.io-client';
import _ from 'lodash';
import * as keys from '../global/keys';

const Socket = {
    connect: function(token) {
        let socket = SocketIOClient(keys.SERVER, {
            'query': 'token=' + token
        });

        

        socket.on('connect', () => {
            console.log('it connected')
        })

        socket.on('disconnect', () => {
            console.log('it disconnected')
        })
    }
}

export default Socket;
