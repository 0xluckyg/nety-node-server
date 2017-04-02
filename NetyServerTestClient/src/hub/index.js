import Authorization from './authorization';
import SocketManager from './socketManager';
import {setUserId, setToken} from '../redux/actions';
import store from '../redux/store';

let token;

const Hub = {
    //res has two properties:
        //success: whether the request succeeded or not
        //data: token or error
    signup: function(user) {
        Authorization.signup(user, (res) => {
            if (res.success) {
                token = res.data;
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
                token = res.data;
                //Save user token
                SocketManager.connect(token, () => {
                    store.dispatch(setToken(token));
                })
                //Save user Id
                SocketManager.getUserByToken(token, (user) => {
                    store.dispatch(setUserId(user._id));
                    console.log('userId: ', store.getState().id);
                });

                console.log(`signin successful with token: ${res.data}`)
            } else {
                console.log(`signin failed with error: ${res.data}`)
            }
        });
    },
    logout: function() {
        SocketManager.logout(token, () => {
            store.dispatch(setToken(''))
        })        
    },
    getNetwork: function() {
        SocketManager.getNetwork()
    }
}

export default Hub;
