const supertest = require('supertest');
const sinon = require('sinon');
const amqp = require('amqplib/callback_api');
const express = require('express');
const send_to_rabbit = require('../src/send_to_rabbit.js');

// TODO this should be a dev instance of rabbitmq
var app = supertest.agent("http://localhost:3000");

// https://blog.risingstack.com/node-hero-node-js-unit-testing-tutorial/


describe('RabbitMQ Connection', function() {

    it('connect to running RabbitMQ service', function(done) {
        
    });
    
    it('fail well when RabbitMQ service not running', function() {
    
    });
    
});
