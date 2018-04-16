// TODO should be dev server (diff port?)
const server = require('../src/server.js');
const request = require('supertest');
const enableDestroy = require('server-destroy');

// TODO code coverage doesn't reach server.js
// --- See https://github.com/istanbuljs/nyc/issues/762 for possible solution
// Supertest - https://github.com/visionmedia/supertest

describe('Express server unit tests', function() {

    after(function(done) {
        enableDestroy(server);
        server.destroy(done);
    });

    it('respond to get with 200 and json welcome message', function (done) {
        request(server)
            .get('/')
            .set('Accept', 'application/json')
            .expect(200, {
                message: 'Welcome to Walter\'s app...now send a POST to /logs'
            }, done)
    });

    it('server accepts valid JSON post', function (done) {
        request(server)
            .post('/logs')
            .set('Content-Type', 'application/json')
            .send({content: 'my_content'})
            .expect('Ready for another...\n', done)
    });

    it('server rejects empty JSON post', function (done) {
        request(server)
            .post('/logs')
            .set('Content-Type', 'application/json')
            .send('{}')
            .expect(400, {
                message: 'Note content cannot be empty'
            }, done)
    });

    it('server rejects invalid JSON post', function (done) {
        request(server)
            .post('/logs')
            .set('Content-Type', 'application/json')
            .send('{ error: "my_error }')
            .expect(400, {
                message: "Invalid Request data"
            }, done)
    });

    it('server rejects URLencoded data post', function (done) {
        request(server)
            .post('/logs')
            .send('error=my_error')
            .expect(400, {
                message: 'Note content cannot be empty'
            }, done)
    });

    // it('server calls sendToRabbit() function for a valid post', function () {
    //     // Is this a different copy of the function than what's in server?
    //     // Is promise actually waiting before assert.isTrue?
    //     let sendToRabbit = require('../src/send_to_rabbit.js');
    //     sinon.spy(sendToRabbit);
    //     return (request(server)
    //         .post('/logs')
    //         .set('Content-Type', 'application/json')
    //         .send({content: 'my_content'}))
    //         .then(
    //             assert.isTrue(sendToRabbit.called),
    //             sentToRabbit.restore()
    //         );
    // });

});