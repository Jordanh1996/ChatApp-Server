const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
        minlength: 6
    },
    receiver: {
        type: String,
        required: true,
        minlength: 6
    },
    messages: [{
        sender: {
            type: String,
            minlength: 6
        },
        content: {
            type: String,
            minlength: 1,
        }
    }]
});

ConversationSchema.methods.addMessage = function (sender, content) {
    const message = {
        sender,
        content
    };
    
    this.messages.push(message);
    return this.save();
};

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = {Conversation};