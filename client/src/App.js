import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Room from './components/Room';
import { w3cwebsocket } from "websocket";

const client = new w3cwebsocket('ws://127.0.0.1:8000');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: '',
      messages: [],
      msgInput: '',
      roomInput: '',
      rooms: []
    };
  }

  componentWillMount() {
    client.onmessage = resp => {
      const data = JSON.parse(resp.data);
      if (data.type === 'newMsg') {
        this.setState(prevState => ({
          messages: [...prevState.messages, data.message],
          msgInput: ''
        }));
      } else if (data.type === 'getMessages') {
        this.setState(prevState => ({
          messages: [...data.messages],
          msgInput: ''
        }));
      } else if (data.type === 'getRooms') {
        this.setState(prevState => ({
          rooms: [...data.rooms]
        }));
      } else if (data.type === 'newRoom') {
        this.setState(prevState => ({
          rooms: [...prevState.rooms, data.room],
          roomInput: ''
        }));
      }
    };

    client.onopen = () => {
      console.log('websockets running');
      client.send(JSON.stringify({
        type: 'getRooms'
      }));
    };
  }

  componentWillUnmount() {
    // client.close();
    // causes WebSocket is already in CLOSING or CLOSED state.
  }

  newMsg = event => {
    event.preventDefault();
    client.send(JSON.stringify({
      type: 'newMsg',
      content: event.target[1].value,
      room: this.state.room,
      user: "james"
    }));
  }

  newRoom = event => {
    event.preventDefault();
    client.send(JSON.stringify({
      type: 'newRoom',
      name: event.target[1].value
    }));
  }

  msgInputUpdate = event => {
    const newVal = event.target.value;
    this.setState({msgInput: newVal});
  }

  roomInputUpdate = event => {
    const newVal = event.target.value;
    this.setState({roomInput: newVal});
  }

  setRoom = room => {
    this.setState({room});
    client.send(JSON.stringify({
      type: 'getMessages',
      room: room
    }));
  }

  render() {
    return (
      <div className="App">
        {this.state.room ? (
          <Room
            room={this.state.room}
            newMsg={this.newMsg}
            setRoom={this.setRoom}
            messages={this.state.messages}
            msgInputUpdate={this.msgInputUpdate}
            msgInput={this.state.msgInput}
          />
        ) : (
          <Home
            setRoom={this.setRoom}
            rooms={this.state.rooms}
            newRoom={this.newRoom}
            roomInput={this.state.roomInput}
            roomInputUpdate={this.roomInputUpdate}
          />
        )}
      </div>
    );
  }
}

export default App;
