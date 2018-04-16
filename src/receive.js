var amqp = require('amqplib/callback_api');

// I planned to use this for e2e testing
amqp.connect('amqp://guest:guest@localhost:5672', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'test';

        ch.assertQueue(q, {durable: true});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {noAck: true});
    });

    setTimeout(function() { conn.close(); }, 500);
});
