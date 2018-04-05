const _ = require('lodash');
const Service = require('./conversation.service');
const {Conversation} = require('../../models/conversation');

const startConversation = (req, res) => {
    const body = _.pick(req.body, ['receiver']);
    Service.findConversation(req.user.username, body.receiver).then((excists) => {
        if (excists) {
            return res.status(400).send();
        };
        const conversation = Service.saveConversation(req.user.username, body.receiver);
        conversation.save().then((started) => {
            if (started) {
                return res.send({
                    started: true,
                    sender: req.user.username,
                    receiver: body.receiver
                });
            };
            res.status(400).send();
        })
    }).catch((e) => {
        res.status(400).send();
    });
};

const sendMessage = (req, res) => {
    const body = _.pick(req.body, ['receiver', 'content']);
    Service.findConversation(req.user.username, body.receiver).then((conversation) => {
        conversation.addMessage(req.user.username, body.content).then(() => {
            res.send({
                status: 'sent',
                sender: req.user.username,
                content: body.content
            });
        });
    }).catch((e) => {
        res.status(400).send();
    });
};

const getConversations = (req, res) => {
    Service.getConversations(req.user.username).then((conversations) => {
        res.send({conversations});
    }).catch((e) => {
        res.status(400).send()
    });
};

const getUsers = (req, res) => {
    Service.getUsers().then((users) => {
        const userNames = users.map((user) => {
            return user.username;
        });
        res.send(userNames);
    });
};

module.exports = {
    startConversation,
    sendMessage,
    getConversations,
    getUsers
};