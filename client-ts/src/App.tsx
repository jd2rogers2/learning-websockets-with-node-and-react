import * as React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Home } from './components/Home';
import Room from './components/Room';
import { w3cwebsocket } from "websocket";

const client = new w3cwebsocket('ws://127.0.0.1:8000');

class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
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
    client.onmessage = (resp) => {
      const data: IWebSocketData = JSON.parse(resp.data);
      if (data.type === 'newMessage') {
        this.setState((prevState: IAppState) => ({
          messages: [...prevState.messages, data.message],
          messageInput: ''
        }));
      } else if (data.type === 'getMessages') {
        this.setState({
          messages: [...data.messages],
          messageInput: ''
        });
      } else if (data.type === 'getRooms') {
        this.setState({
          rooms: [...data.rooms]
        });
      } else if (data.type === 'newRoom') {
        this.setState((prevState: IAppState) => ({
          rooms: [...prevState.rooms, data.room],
          roomInput: ''
        }));
      } else if (data.type === 'likeMessage') {
        if (data.message.room === this.state.room) {
          this.setState((prevState: IAppState) => {
            return {
              messages: prevState.messages.map(msg => {
                if (msg._id === data.message._id) {
                  return {...msg, liked: true};
                }
                return msg;
              })
            };
          });
        }
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

  newMessage = (event: React.FormEvent<HTMLFormElement>, user: string) => {
    event.preventDefault();
    client.send(JSON.stringify({
      type: 'newMessage',
      content: this.state.messageInput,
      room: this.state.room,
      user
    }));
  }

  newRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    client.send(JSON.stringify({
      type: 'newRoom',
      name: this.state.roomInput
    }));
  }

  messageInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;
    this.setState({messageInput: newVal});
  }

  roomInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;
    this.setState({roomInput: newVal});
  }

  // should be handle room click? this redirects to room component
  setRoom = (room: string) => {
    this.setState({
      messages: [],
      room
    });
    if (room !== '') {
      client.send(JSON.stringify({
        type: 'getMessages',
        room
      }));
    }
  }

  likeMessage = (message: IMessage) => {
    client.send(JSON.stringify({
      type: 'likeMessage',
      message
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
            likeMessage={this.likeMessage}
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
