// {content: "hi", user_id: 1, id: 1}
// {username: "user1", room_id: 1, id: 1}
// {name: "room1", id: 1}

const MONGO_URL = `mongodb+srv://joeyj:${MONGO_PWD}@learning-websockets-agm6f.mongodb.net/test?retryWrites=true&w=majority`;
const WEBSOCKET_PORT = 8000;
const webSocketServer = require('websocket').server;
const server = require('http').createServer();
const mongoClient = require('mongodb').MongoClient;

server.listen(WEBSOCKET_PORT);
const wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', request => {
  const connection = request.accept(null, request.origin);
  connection.on('message', message => {
    const data = JSON.parse(message.utf8Data);

    // send to db and get db data back and then
    // connection.send('stuff to client')
    if (data.type === 'newMsg') {
      // {useNewUrlParser: true}
      mongoClient.connect(MONGO_URL, (err, db) => {
        if (err) {
          //error
        } else {
          console.log("connected to mongodb");
          const messages = db.collection('messages').find({});
          connection.send({type: 'msg', messages});
        }
      })
    }
  });
});
