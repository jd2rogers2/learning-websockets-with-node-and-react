// {content: "hi", user_id: 1, id: 1}
// {username: "user1", room_id: 1, id: 1}
// {name: "room1", id: 1}

const MONGO_URL = 'mongodb+srv://joeyj:<password>@learning-websockets-agm6f.mongodb.net/test?retryWrites=true&w=majority';
const WEBSOCKET_PORT = 8000;
const webSocketServer = require('websocket').server;
const server = require('http').createServer();
server.listen(WEBSOCKET_PORT);
const wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', request => {
  const connection = request.accept(null, request.origin);

  connection.on('message', message => {
    // send to db and get db data back and then
    // connection.send('stuff to client')
  });
});
