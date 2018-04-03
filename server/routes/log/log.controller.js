const _ = require('lodash');
const {User} = require('../../models/user');
const Service = require('./log.service');

const LogIn = (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);
    User.findByCredentials(body.username, body.password)
    .then((user) => {
        user.generateAuthToken()
        .then((token) => {
            res.send({
                loggedIn: true,
                token
            });
        });
    }).catch((e) => {
        res.status(404).send();
    });
};

const Register = (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);
    const user = Service.createUser(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.send({
            username: user.username,
            _id: user._id,
            token,
            created: true
        });
    }).catch((e) => {
        res.status(400).send();
    });
};

const UserCheck = (req, res) => {
    Service.checkUsername(req.params.username)
        .then((user) => {
            if (user) {
                return res.send({
                    taken: 'true'
                });
            };
            res.send({
                taken: 'false'
            });
        }).catch((e) => {
            res.status(400);
        });
};

module.exports = {
    LogIn,
    Register,
    UserCheck,
};