// {content: "hi", user_id: 1}
// {username: "user1", room_id: 1}
// {name: "room1"}
// ids provided by mongodb

const WEBSOCKET_PORT = 8000;
const webSocketServer = require('websocket').server;
const server = require('http').createServer();

const MONGO_URL = 'mongodb+srv://joeyj:' + process.env.MONGO_PWD + '@learning-websockets-agm6f.mongodb.net/test?retryWrites=true&w=majority';
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(MONGO_URL, {useNewUrlParser: true});

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
      client.connect(err => {
        if (err) {
          console.log(err);
        } else {
          //, userId: data.userId});
          client.db('learning-websockets').collection('messages').insertOne({content: data.content}).then(resp => {
            const newMsg = resp.ops[0];
            connection.send(JSON.stringify({type: 'newMsg', message: newMsg}));
          });
          // console.log(messages);
        }
        client.close();
      })
    }
  });
});
