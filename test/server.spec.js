const supertest = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const express = require('express');
const send_to_rabbit = require('../src/send_to_rabbit.js');

// TODO this should be a dev instance of rabbitmq
var app = supertest.agent("http://localhost:3000");
var assert = chai.assert;

describe('GET /', function() {

    it('respond with 200 and json welcome message', function(done) {
        app
            .get('/')
            .set('Accept', 'application/json')
            .expect(200, {
                message: 'Welcome to Walter\'s app...now send a POST to /logs'
            }, done)
    });
    
});

describe('POST /logs', function() {
    
    // http://sinonjs.org/releases/v4.5.0/mocks/
    // https://github.com/visionmedia/supertest
    it('server calls send() function', function() {
        // TODO setup and teardown spy
        var sendSpy = sinon.spy(send_to_rabbit);
        return app
            .post('/logs')
            .set('Content-Type', 'application/json')
            .send({ error: 'my_error' })
            .then(response => {
                 assert.isTrue(sendSpy.called);
             });
       
    });
    
    it('server accepts valid JSON to send() function', function(done) {
        app
            .post('/logs')
            .set('Content-Type', 'application/json')
            .send({ error: 'my_error' })
            .expect('Ready for another...\n', done)
    });
    
    it('server rejects empty JSON', function(done) {
        app
            .post('/logs')
            .set('Content-Type', 'application/json')
            .send('{}')
            .expect(400, {
                message: 'Note content cannot be empty'
            }, done)
    });
    
    it('server rejects URLencoded data', function(done) {
        app
            .post('/logs')
            .send('error=my_error')
            .expect(400, {
                message: 'Note content cannot be empty'
            }, done)
    });
    
    it('server rejects invalid JSON', function(done) {
        app
            .post('/logs')
            .set('Content-Type', 'application/json')
            .send('{ error: "my_error }')
            .expect(400, {
                message: "Invalid Request data"
            }, done)
    }); 
    
});
