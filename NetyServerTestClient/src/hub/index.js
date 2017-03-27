import Authorization from './authorization';
import SocketManager from './socketManager';


const hub = {
    signup: function(user) {
        Authorization.signup(user, (res) => {
            if (res.success) {
                //Data is the token
                SocketManager.connect(res.data)
                console.log(`signup successful with token: ${res.data}`)
            } else {
                console.log(`signup failed with error: ${res.data}`)
            }
        });
    },
    login: function(user) {
        Authorization.login(user, (res) => {
            if (res.success) {
                //Data is the token
                SocketManager.connect(res.data)
                console.log(`signin successful with token: ${res.data}`)
            } else {
                console.log(`signin failed with error: ${res.data}`)
            }
        });
    },
}

export default hub;
