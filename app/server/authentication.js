const {User} = require('../models/user');
const _ = require('lodash');

function signup(app) {
    app.post('/signup', function (req, res) {                
        const body = _.pick(req.body, ['name', 'email', 'password']);        
        //DUMMY LOCATION
        body.loc = {
            type: 'Point',
            coordinates: [-73.98767179999999,40.7285977]
        };   
        const user = new User(body);                
        user.save().then(() => {
            return user.generateAuthToken();
        }).then(token => {            
            res.header('x-auth', token).send(user);
        }).catch(err => {
            if (err.errors !== undefined) {
                const errorMessage = err.errors[Object.keys(err.errors)[0]].message;                
                res.status(400).send(errorMessage);
            } else {
                res.status(400).send(JSON.stringify(err));
            }
        });
    });
}

function login(app) {
    app.post('/login', function (req, res) {        
        const body = _.pick(req.body, ['email', 'password']);        
        User.findByCredentials(body.email, body.password).then(user => {
            return user.generateAuthToken().then(token => {
                res.header('x-auth', token).send(user);
            });
        }).catch(err => {
            res.status(400).send(JSON.stringify(err));
        });
    });
}

module.exports = {
    signup,
    login
};