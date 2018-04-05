const {Conversation} = require('../../models/conversation');
const {User} = require('../../models/user');

const saveConversation = (sender, receiver) => {
    const conversation = new Conversation({
        sender,
        receiver
    });
    return conversation;
};

const findConversation = (sender, receiver) => {
    return Conversation.findOne({
        $or: [{sender, receiver}, {sender: receiver, receiver: sender}]
    });
};

const getConversations = (username) => {
    return Conversation.find({
        $or: [{sender: username}, {receiver: username}]
    });
};

const getUsers = () => {
    return User.find(
        {},
        {username: 1, _id: 0}
    );
};

module.exports = {
    saveConversation,
    findConversation,
    getConversations,
    getUsers
};