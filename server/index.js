const MONGO_URL = 'mongodb+srv://joeyj:' + process.env.MONGO_PWD + '@learning-websockets-agm6f.mongodb.net/test?retryWrites=true&w=majority';
const mongoOptions = {useNewUrlParser: true, poolSize: 10, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000};
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongoClient = new MongoClient(MONGO_URL, mongoOptions);
const ObjectID = mongo.ObjectID;

const WEBSOCKET_PORT = 8000;
const webSocketServer = require('websocket').server;
const server = require('http').createServer();
server.listen(WEBSOCKET_PORT);
const wsServer = new webSocketServer({
  httpServer: server
});

const clients = {};
let clientId = 0;

mongoClient.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("mongodb connected");
    wsServer.on('request', request => {
      const connection = request.accept(null, request.origin);
      // console.log("here");
      // console.log(connection);
      clients[++clientId] = connection;

      connection.on('message', message => {
        const data = JSON.parse(message.utf8Data);
        const messages = mongoClient.db('learning-websockets').collection('messages');
        const rooms = mongoClient.db('learning-websockets').collection('rooms');

        if (data.type === 'newMessage') {
          messages.insertOne({content: data.content, liked: false, room: data.room, user: data.user}).then(resp => {
            const newMessage = resp.ops[0];
            console.log("new message sent to db successfully. id: " + newMessage._id);
            for (let key in clients) {
              clients[key].send(JSON.stringify({type: 'newMessage', message: newMessage}));
            }
          }).catch(error => {
            console.log(error);
          });
        } else if (data.type === 'getMessages') {
          messages.find({room: data.room}).toArray((err, result) => {
            if (err){
              console.log(err);
            } else {
              console.log(`getMessages successful, sending ${result.length} messages to client. `);
              for (let key in clients) {
                clients[key].send(JSON.stringify({type: 'getMessages', messages: result}));
              }
            }
          });
        } else if (data.type === 'getRooms') {
          rooms.find({}).toArray((err, result) => {
            if (err){
              console.log(err);
            } else {
              console.log(`getRooms successful, sending ${result.length} rooms to client. `);
              for (let key in clients) {
                clients[key].send(JSON.stringify({type: 'getRooms', rooms: result}));
              }
            }
          });
        } else if (data.type === 'newRoom') {
          rooms.insertOne({name: data.name}).then(resp => {
            const newRoom = resp.ops[0];
            console.log("new room sent to db successfully. id: " + newRoom._id);
            for (let key in clients) {
              clients[key].send(JSON.stringify({type: 'newRoom', room: newRoom}));
            }
          }).catch(error => {
            console.log(error);
          });
        } else if (data.type === 'likeMessage') {
          messages.updateOne({_id: new ObjectID(data.message._id)}, {$set: {"liked": true}}, (err, resp) => {
            if (err) {
              console.log(err);
            } else {
              if (resp.modifiedCount === 1) {
                console.log(`message with id ${message._id} liked. `);
                for (let key in clients) {
                  clients[key].send(JSON.stringify({type: 'likeMessage', message: {...data.message, liked: true}}));
                }
              } else {
                console.log("message found but no update made. ");
              }
            }
          });
        }
      });
    });
  }
});
