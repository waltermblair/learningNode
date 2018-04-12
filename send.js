const amqp = require('amqplib/callback_api');
const express = require('express');
const bodyParser = require('body-parser');
const server = require('./server.js');

function send(req_body) {
                                       
    amqp.connect('amqp://guest:guest@localhost:5672', function(err, conn) {
        
        if (err) { return console.log(err); }   
              
        conn.createChannel(function(err, ch) {
        
            if (err) { return console.log(err); }   
        
            var ex = 'logs';
            var msg = JSON.stringify(req_body);
            ch.assertExchange(ex, 'fanout', {durable: true});
            ch.publish(ex, '', new Buffer(msg));
            console.log(" [x] Sent %s", msg);
        });
        
        // Close the connection
        setTimeout(function() { conn.close(); }, 60);
      
    });
    
};

module.exports = send;
