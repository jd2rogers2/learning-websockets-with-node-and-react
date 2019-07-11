// {content: "hi", user_id: 1}
// {username: "user1", room_id: 1}
// {name: "room1"}
// ids provided by mongodb

const MONGO_URL = 'mongodb+srv://joeyj:' + process.env.MONGO_PWD + '@learning-websockets-agm6f.mongodb.net/test?retryWrites=true&w=majority';
const mongoOptions = {useNewUrlParser: true, poolSize: 10, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000};
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(MONGO_URL, mongoOptions);

const WEBSOCKET_PORT = 8000;
const webSocketServer = require('websocket').server;
const server = require('http').createServer();
server.listen(WEBSOCKET_PORT);
const wsServer = new webSocketServer({
  httpServer: server
});

mongoClient.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("mongodb connected");
    wsServer.on('request', request => {
      const connection = request.accept(null, request.origin);

      connection.on('message', message => {
        const data = JSON.parse(message.utf8Data);

        if (data.type === 'newMsg') {
          // , userId: data.userId});
          mongoClient.db('learning-websockets').collection('messages').insertOne({content: data.content}).then(resp => {
            const newMsg = resp.ops[0];
            console.log("new message sent to db successfully. id: " + newMsg._id);
            connection.send(JSON.stringify({type: 'newMsg', message: newMsg}));
          }).catch(error => {
            console.log(error);
          });
        }
      });
    });
  }
});
