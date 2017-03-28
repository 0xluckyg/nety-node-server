import Authorization from './authorization';
import SocketManager from './socketManager';
import {getToken, setToken} from '../redux/actions';
import store from '../redux/store';

const Hub = {
    //res has two properties:
        //success: whether the request succeeded or not
        //data: token or error

    signup: function(user) {
        Authorization.signup(user, (res) => {
            if (res.success) {
                let token = res.data;
                SocketManager.connect(token)
                store.dispatch(setToken(token))

                console.log(`signup successful with token: ${res.data}`)
            } else {
                console.log(`signup failed with error: ${res.data}`)
            }
        });
    },
    login: function(user) {
        Authorization.login(user, (res) => {
            if (res.success) {
                let token = res.data;
                SocketManager.connect(token)
                store.dispatch(setToken(token))
                
                console.log(`signin successful with token: ${res.data}`)
            } else {
                console.log(`signin failed with error: ${res.data}`)
            }
        });
    },
}

export default Hub;
