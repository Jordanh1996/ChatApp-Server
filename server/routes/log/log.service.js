const {User} = require('../../models/user');

const createUser = (body) => {
    const user = new User(body);
    return user;
};

const checkUsername = (username) => {
    return User.findOne({
        username
    });
};

module.exports = {
    createUser,
    checkUsername
};