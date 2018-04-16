## How-To
1. `docker run -d --hostname my-rabbit --name some-rabbit -p 8080:15672 -p 5672:5672 rabbitmq:3-management`
2. `npm install`
3. `npm start`
3. `curl -X POST -H "Content-Type: application/json" -d '{"employment-goal":"achieved"}' localhost:3000/logs`

## Done
1. Refactor
2. Logging
3. Error handling
4. Testing Strategy
5. Code coverage

## To-Do
1. Test Implementation
  1. e2e testing
  1. mock rabbit
  1. spy sendToRabbit
2. Docker - production
3. Docker - testing w/ Docker-compose
4. Retrieving RabbitMQ reply
5. Refactor tests
6. Final Documentation
7. Java version

## Walter's Process

We left off Thursday morning with a single-file Express node.js application that passes stub sentry data to a dockerized RabbitMQ service. I started with the to-do list above, prioritizing code structure and unit testing and finishing up with a nice self-contained demo deployment.  

My priority with refactoring was to get my encapsulation on with the single-file app we wrote. I wanted to separate the app into a server that runs continuously and the post service that connects to RabbitMQ temporarily. I'm not sure whether this a nodeful goal, but I think it will make testing more straightforward. After separating the server and send function, the next step was to stop send's POST process without killing the server. Next I wanted the app to receive a reply from RabbitMQ indicating to my client whether the post was successful, TBD on that. Finally, I found myself to be really uncomfortable with node's asynchronous programming and our use of callbacks rather than the promises I'm more familiar with in js, so I settled in with squaremobius.net/amqp.node/channel_api.html and went back through with really deliberate use of callbacks. Realizing that there are two parallel API's using either Promises or callbacks made me realize I'm not crazy for trying amqp.connect().then() a million times and failing. When the convention of function(err, success) callbacks clicked, everything started making a ton more sense.  

When the scripts seemed reasonably nice to me, I started on logging. I chose morgan, as it's the typical logger for express, and this took a couple of minutes to put together. I made a note to check my error handling from some of the material I was reading. By default I handled all errors with callback functions, but I sifted through https://www.joyent.com/node-js/production/design/errors for best practices. I think for this simple app, try/catch is useful for synchronous JSON.stringify, and callbacks are great for all the asynchronous functionality.  

For testing, I'm thankful this is a small app. I've done some ajax testing with Rails, but node has been blowing my mind. I'd like to start with some unit tests of server.js, and then I'd like to be sure I fail well when the RabbitMQ service is unavailable, which I think will involve mocking RabbitMQ via sinon. I'm not sure there's much robustness testing to do here, since the JSON and URLencoded parser checks the POST data. I guess the question there is whether my error handling is sufficient. Later down the road I'll do some integration testing that fits in with my deployment strategy. I'm starting with the mocha framework and supertest for http. Testing for invalid non-empty inputs motivated me again to spruce up my bodyparser error handling. I decided to eliminate URLencoded data, because it's unnecessary for our application and presents a potential vulnerability. I picked up istanbul for code coverage, ran it to find 25%, and put my nose back to the testing. I realized later that istanbul is only finding one of my specs, so I'll need to figure out how to configure it or switch coverage tools.  

So what I plan to do is finish testing send_to_rabbit by mocking RabbitMQ and also make sure that server.js is calling this function. I also need to fail well when RabbitMQ is offline. When I'm comfortable with my testing, I want to practice using Docker by deploying my app with it and also composing the production code with a separate testing container. Then I'll clean things up and send again!  

Getting back to it on Sunday, I decided to start using Webstorm with the hope of gaining some efficiency and avoiding trivial mistakes. Next I took a step back from my tests to do some necessary setup - I want tests to set up a new server that connects to a test instance of rabbitmq. I am thinking more clearly about the difference between unit testing my Express server, testing the integration between my server and rabbit client, and testing the integration between my rabbit client and rabbit. I have my basic server unit tests done, so now I need to test the sentToRabbit client's interactions with rabbit, and then see if I still have a reason to check that the server is actually calling the sendToRabbit function, which is a test I'm struggling to get working. On the plus side, after refactoring my tests in the process by creating a server before my server unit tests, my istanbul code coverage now hits all my code!  

I moved on to test send_to_rabbit.js, and I wanted to setup and teardown a test rabbit instance before running these tests. After struggling for awhile on the asynchronous hook that executes docker system calls, I took a step back and realized that I should setup and teardown a mock instead so that the tests run at a reasonable speed. I can start the docker container manually for now if I want to check the exchange for some reason. Looking at the amqp-node library, it looks like there has been some interest in the past in creating a mocking toolkit for the amqp connection (https://github.com/squaremo/amqp.node/issues/71), but it looks like this is a bit more work than I can handle at the moment.  

I'm going to leave my attempt to use Sinon spies and mocks to test my sent_to_rabbit function and integration with RabbitMQ in favor of some black-box e2e testing. Given that the amqp-node code I'm using is taken almost verbatim from the documentation, I'm confident enough that send_to_rabbit.js works well on its own to be rely on black-box tests to round out my testing efforts. Cucumber is the e2e framework I'm most familiar with, and I have used cucumberjs before to test ajax for my Rails project last fall, so I'm going to see if I can get that going here.  

It's Monday morning now, and I think it's time to summarize my efforts. I was hoping that my version 2 would have a nice set of integration and e2e tests as well as a shiny new Docker deployment, but alas! I got really bogged down with this crash course in asynchronous programming, and getting my asynchronous tests to run was much tougher than I imagined. I often had a hard time understanding where the problem was, like when I couldn't seem to get my tests to wait on promises before asserting or expecting something in particular. I often couldn't decide if my source code was malformed, if I needed to use v8 async/await, if I needed to use an asynchronous assertion library like chai-as-promised, if I was using cucumber-js incorrectly, or some combination of all of these. I think I have a good idea of the high-level strategy that I wanted to accomplish with my testing, and that I would have really benefited from working with a partner to iron out the implementation tricks of node.js. I built myself a very tangled knot of node.js that makes me feel a little crazy, so I'm going to spend a bit of spare time trying to do this app in Java to get a little confidence back in the short term. What I do have at least is a good example of the perils of relying too much on simple code coverage metrics. Istanbul finally works and gives me 96% on server.js and 83% on send_to_rabbit.js, but I think the real story is in the branch coverage which is only 75% and 50% respectively. I'm still really interested in mocking the RabbitMQ service so that I can switch it on and off and various permutations so that I can see whether my app handles integration successes and failures. We'll meet again, node.  


