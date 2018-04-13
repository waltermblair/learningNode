const amqp = require('amqplib/callback_api');
const express = require('express');

function send(req_body) {
                                       
    amqp.connect('amqp://guest:guest@localhost:5672', function(err, conn) {
        
        if (err) { return console.log(err); }   
              
        conn.createChannel(function(err, ch) {
        
            if (err) { return console.log(err); }   
        
            var ex = 'logs';
            
            // TODO I'm not sure anything that makes it pasts bodyparser 
            //     would be a problem here
            try { 
                var msg = JSON.stringify(req_body);
            } catch(e) {
                console.log(e);
            }
            
            ch.assertExchange(ex, 'fanout', {durable: true});
            ch.publish(ex, '', new Buffer(msg));
            console.log(" [x] Sent %s", msg);
        });
        
        // Close the connection
        setTimeout(function() { conn.close(); }, 60);
      
    });
    
};

module.exports = send;
