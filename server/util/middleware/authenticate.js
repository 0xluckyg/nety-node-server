const {User} = require('../../models/user');

//middleware
let authenticate = (token) => {
    User.findByToken(token).then((user) => {   
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        //call next to move on
        next();
    }).catch((err) => {
        return res.status(401).send();
    });
}

module.exports = {
    authenticate: authenticate
}
