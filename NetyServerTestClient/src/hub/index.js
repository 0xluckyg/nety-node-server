import Authorization from './authorization';
import SocketManager from './socketManager';


const hub = {
    signup: function(user) {
        Authorization.signup(user, (res) => {
            if (res.success) {
                SocketManager.connect(res.data)
            } else {

            }
        });
    },
}

export default hub;
