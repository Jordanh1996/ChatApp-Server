const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.generateAuthToken = function() {
    var user = this
    var access = 'auth'
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = [{access, token}]

    return user.save().then(() => {
        return token
    })
}

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })

}

UserSchema.statics.findByCredentials = function(username, password) {
    return this.findOne({username}).then((user) => {
        if (!user) {
            return Promise.reject()
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })
    })
}

UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next();
            })
        })
    } else {
        next()
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = {User};