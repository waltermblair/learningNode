const amqp = require('amqplib/callback_api');
const express = require('express');

function send_to_rabbit(req_body, RabbitUrl, callback) {
                                       
    return amqp.connect(RabbitUrl, function(err, conn) {
        
        if (err) { return console.log(`The RabbitMQ service is unavailable at ${err.address}:${err.port}!\n`); }
              
        conn.createChannel(function(err, ch) {
        
            if (err) { return console.log(err); }
        
            var ex = 'logs';
            
            // TODO I'm not sure anything that makes it pasts bodyparser would be a problem here, so is try/catch redundant?
            try { 
                var msg = JSON.stringify(req_body);
            } catch(e) {
                console.log(e);
            }
            
            ch.assertExchange(ex, 'fanout', {durable: true});
            ch.publish(ex, '', new Buffer(msg));
            console.log(" [x] Sent %s", msg);
        });
        
        // Close the rabbit connection
        setTimeout(function() { conn.close(); }, 500);
      
    });
    
}

module.exports = send_to_rabbit;
