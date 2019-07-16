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
      messageInput: '',
      roomInput: '',
      rooms: []
    };
  }

  componentWillMount() {
    client.onmessage = resp => {
      const data = JSON.parse(resp.data);
      if (data.type === 'newMessage') {
        this.setState(prevState => ({
          messages: [...prevState.messages, data.message],
          messageInput: ''
        }));
      } else if (data.type === 'getMessages') {
        this.setState(prevState => ({
          messages: [...data.messages],
          messageInput: ''
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

  newMessage = event => {
    event.preventDefault();
    client.send(JSON.stringify({
      type: 'newMessage',
      content: this.state.messageInput,
      room: this.state.room,
      user: "james"
    }));
  }

  newRoom = event => {
    event.preventDefault();
    client.send(JSON.stringify({
      type: 'newRoom',
      name: this.state.roomInput
    }));
  }

  messageInputUpdate = event => {
    const newVal = event.target.value;
    this.setState({messageInput: newVal});
  }

  roomInputUpdate = event => {
    const newVal = event.target.value;
    this.setState({roomInput: newVal});
  }

  // should be handle room click? this redirects to room component
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
            newMessage={this.newMessage}
            setRoom={this.setRoom}
            messages={this.state.messages}
            messageInputUpdate={this.messageInputUpdate}
            messageInput={this.state.messageInput}
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
