const supertest = require('supertest');
const sinon = require('sinon');
const amqp = require('amqplib/callback_api');
const express = require('express');
const send = require('../src/send.js');

// TODO this should be a dev instance of rabbitmq
var app = supertest.agent("http://localhost:3000");

// https://blog.risingstack.com/node-hero-node-js-unit-testing-tutorial/


describe('RabbitMQ Connection', function() {

    it('connect to running RabbitMQ service', function(done) {
        app
            .get('/')
            .set('Accept', 'application/json')
            .expect(200, {
                message: 'Welcome to Walter\'s app...now send a POST to /logs'
            }, done)
    });
    
    it('fail well when RabbitMQ service not running', function() {
    
    });
    
});
