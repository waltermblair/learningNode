const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
const sendToRabbit = require('../src/send_to_rabbit.js');

var reqBody = {content: 'my_content'};

describe('RabbitMQ Connection', function() {

    // TODO Setup and breakdown mock RabbitMQ connections
    before(function() {

    });
    after(function() {

    });

    // sinon spy for console.log
    beforeEach(function() {
        sinon.spy(console, 'log');
    });
    afterEach(function() {
        console.log.restore();
    });

    it('connect to running RabbitMQ service', function() {
        const RabbitUrl = 'amqp://guest:guest@localhost:5672';
        function async(err, data) {
            if(err) {

            }
            sendToRabbit(reqBody, RabbitUrl);
        }
    });
    
    it('fail well when RabbitMQ service not running', function() {
        const RabbitUrl = 'amqp://guest:guest@localhost:5672';
        sendToRabbit(reqBody, RabbitUrl);
        chai.expect(console.log.calledWith('The RabbitMQ service is unavailable at 127.0.0.1:5672!\n')).to.eventually.be.true;
    });

    
});
