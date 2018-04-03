const {User} = require('../models/user');

var authenticate = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    const token = req.header('x-auth')
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send()
    })
}

var allowCors = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    next()
}

module.exports = {authenticate, allowCors}