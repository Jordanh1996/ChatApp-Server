require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const logRoute = require('./routes/log');
const conversationRoute = require('./routes/conversation');
const {mongoose} = require('./db/database');

const app = express();
var port = process.env.PORT;

var serverOptions = {
    origin: ['http://localhost:8080'],
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['x-auth', 'Content-Type'],
    exposedHeaders: 'x-auth',
    credentials: true,
    preflightContinue: true
};

app.options('*', cors(serverOptions));

app.use(bodyParser.json());

app.use('/log', logRoute)
app.use('/conversation', conversationRoute)

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
});