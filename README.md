## How-To
1. `docker run -d --hostname my-rabbit --name some-rabbit -p 8080:15672 -p 5672:5672 rabbitmq:3-management`
2. `npm start`
3. `curl -X POST -H "Content-Type: application/json" -d '{"b":"h"}' localhost:3000/logs`

## To-Do
1. Refactor
2. Logging
3. Error handling
4. Testing Strategy
5. Test Implementation
6. Docker - production
7. Docker - testing w/ Docker-compose
8. Retrieving RabbitMQ reply
9. Refactor tests
10. Final Documentation
11. Java version

## Walter's Process

Mark and I left off with a single-file Express node.js application that passes stub sentry data to a dockerized RabbitMQ service. I started with the to-do list above, prioritizing code structure and unit testing and finishing up with a nice self-contained demo deployment.  

My priority with refactoring was to get my encapsulation on with the single-file app we wrote. I wanted to separate the app into a server that runs continuously and the post service that connects to RabbitMQ temporarily. After separating the server and send function, the next step was to stop the POST process without killing the server. Next I wanted the app to receive a reply from RabbitMQ indicating to my client whether the post was successful...TBD...Finally, I found myself to be really uncomfortable with node's asynchronous programming and our use of callbacks rather than the promises I'm more familiar with in js, so I settled in with squaremobius.net/amqp.node/channel_api.html and went back through with really deliberate use of callbacks. Realizing that there are two parallel API's using either Promises or callbacks made me realize I'm not crazy for trying amqp.connect().then() a million times and failing. Also, when the convention of function(err, success) callbacks clicked, everything started making a ton more sense.  

When the scripts seemed reasonably nice to me, I started on logging. I chose morgan, as it's the conventional express logger, and this took a couple of minutes to put together. I made a note to check my error handling from some of the material I was reading. By default I handled all errors with callback functions, but I sifted through https://www.joyent.com/node-js/production/design/errors for best practices. I think for this simple app, try/catch is useful for synchronous JSON.stringify, and callbacks are great for all the asynchronous functionality.  

For testing, I'm thankful this is a small app. I've done some ajax testing with Rails, but node has been blowing my mind. I'll start by e2e testing the POST's to and from the app, and then I'd like to get to be sure I fail well when the RabbitMQ service is unavailable, which I think will involve mocking RabbitMQ via sinon. I'm not sure there's much robustness testing to do here, since the JSON and URLencoded parser checks the POST data. I guess the question there is whether my error handling is sufficient. Later down the road I'll do some integration testing that fits in with my deployment strategy. I'm starting with the mocha framework and supertest for http. Testing for invalid non-empty inputs motivated me again to spruce up my bodyparser error handling. I decided to eliminate URLencoded data, because it's unnecessary for our application and presents a potential vulnerability. I picked up istanbul for code coverage, ran it to find 25%, and put my nose back to the testing.  


