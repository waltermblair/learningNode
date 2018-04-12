## How-To
1. `docker run -d --hostname my-rabbit --name some-rabbit -p 8080:15672 -p 5672:5672 rabbitmq:3-management`
2. `npm start`
3. `curl -X POST -d b=h localhost:3000/logs`
  * or
4. `curl -X POST -H "Content-Type: application/json" -d '{"b":"h"}' localhost:3000/logs`

## To-Do
1. Refactor
1. Error handling
1. Logging
2. Testing Strategy
3. Test Implementation
4. Docker - production
5. Docker - testing w/ Docker-compose
6. RPC system for RabbitMQ reply (or callback?)
7. Java version

## Walter's Process

Mark and I left off with a single-file Express node.js application that passes stub sentry data to a dockerized RabbitMQ service. I started with the to-do list above, prioritizing code structure and unit testing and finishing up with a nice self-contained demo deployment.

My priority with refactoring was to get my encapsulation on with the single-file app we wrote. I wanted to separate the app into a server that runs continuously and the post service that connects to RabbitMQ temporarily. After separating the server and send function, the next step was to stop the POST process without killing the server. Next I wanted the app to receive a reply from RabbitMQ indicating to my client whether the post was successful...TBD...Finally, I found myself to be really uncomfortable with node's asynchronous programming and our use of callbacks rather than the promises I'm more familiar with in js, so I settled in with squaremobius.net/amqp.node/channel_api.html and went back through with really deliberate use of callbacks. Realizing that there are two parallel API's using either Promises or callbacks made me realize I'm not crazy for trying amqp.connect().then() a million times and failing. Also, when the convention of function(err, success) callbacks clicked, everything started making a ton more sense.


