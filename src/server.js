const amqp = require('amqplib/callback_api');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const bodyParser = require('body-parser');
const sendToRabbit = require('./send_to_rabbit.js');

// create express app
const app = express();

//// Logging - rotating daily file
// https://github.com/expressjs/morgan
var logDirectory = path.join(__dirname, '../log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory
});
app.use(morgan('combined', {stream: accessLogStream}));

// TODO any more error handling I want to do with bodyParser?
//   --See https://github.com/expressjs/body-parser/issues/238
//   --See https://github.com/expressjs/body-parser/issues/244
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use((err, req, res, next) => {
    if(err) {
        return res.status(400).json({message: "Invalid Request data"})
    } else {
        next()
    }
});

// define a simple route
app.get('/', (req, res) => {
    res.status(200).json({message:"Welcome to Walter\'s app...now send a POST to /logs"});
});

app.post('/logs', (req, res) => {
    // TODO redundant with bodyParser?
    // Validate request from sentry (including empty JSON object)
    if(!req.body || Object.keys(req.body).length==0) {
        return res.status(400).json({message: "Note content cannot be empty"});
    }

    // Call send_to_rabbit.js to handle rabbit connection
    const RabbitUrl = 'amqp://guest:guest@localhost:5672';
    sendToRabbit(req.body, RabbitUrl);

    // End connection to client
    res.end("Ready for another...\n");

});

// listen for requests
var server = app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

module.exports = server;
