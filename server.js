const amqp = require('amqplib/callback_api');
const express = require('express');
const bodyParser = require('body-parser');
var send = require('./send.js');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Walter\'s app...now send a POST to /logs"});
});

app.post('/logs', (req, res) => {
    // Validate request from sentry (including empty JSON object)
    if(!req.body || Object.keys(req.body).length==0) {
        return res.status(400).send({
            message: "Note content cannot be empty"
        });
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

