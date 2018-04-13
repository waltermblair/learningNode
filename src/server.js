const amqp = require('amqplib/callback_api');
const express = require('express');
const fs = require('fs')
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream')
const bodyParser = require('body-parser');
const send = require('./send.js');

// create express app
const app = express();

// https://github.com/expressjs/morgan
var logDirectory = path.join(__dirname, '../log')
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

// TODO any error handling I want to do with bodyParser?
//   --See https://github.com/expressjs/body-parser/issues/238
// parse requests of content-type - application/json
app.use(bodyParser.json());

// bodyparser error handling
//   --See https://github.com/expressjs/body-parser/issues/244
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
    // Validate request from sentry (including empty JSON object)
    if(!req.body || Object.keys(req.body).length==0) {
        return res.status(400).json({message: "Note content cannot be empty"});
    }
    
    // Call send.js to handle rabbit connection and msg
    send(req.body);

    // End connection to sentry
    res.end("Ready for another...\n");

});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

