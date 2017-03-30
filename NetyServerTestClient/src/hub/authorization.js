import SocketIOClient from 'socket.io-client';
import _ from 'lodash';
import axios from 'axios';
import * as keys from '../global/keys';

const Auth = {
    signup: function(state, callback) {
        let response = {
            success: true,
            data: ''
        };
        axios.post(`${keys.SERVER}/signup`,
            _.pick(state, ['age', 'name', 'email', 'password'])
        ).then((res) => {
            response.data = res.headers['x-auth'];
            callback(response)
        }).catch((err) => {
            console.log('error: ' + err)
            response.success = false;
            if (err.response != undefined) {
                response.data = err.response.data
            }
            callback(response)
        })
    },

    login: function(state, callback) {
        let response = {
            success: true,
            data: ''
        };
        axios.post(`${keys.SERVER}/login`,
            _.pick(state, ['email', 'password'])
        ).then((res) => {
            response.data = res.headers['x-auth'];
            callback(response)
        }).catch((err) => {
            console.log(err)
            response.success = false;
            if (err.response != undefined) {
                response.data = err.response.data
            }
            callback(response)
        })
    }
}

export default Auth;
