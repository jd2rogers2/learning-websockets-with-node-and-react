import React from 'react';
// import logo from './logo.svg';
import './App.css';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { w3cwebsocket } from "websocket";

const client = new w3cwebsocket('ws://127.0.0.1:8000');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // {content: "hi", user_id: 1, id: 1}
      // {username: "user1", room_id: 1, id: 1}
      // {name: "room1", id: 1}
      messages: [{content: "hi", user_id: 1, id: 1}],
      rooms: [{name: "room1", id: 1}],
      inputText: ''
    };
  }

  componentWillMount() {
    client.onopen = () => {
      console.log('websockets running');
    };
    // like listener
    client.onmessage = message => {
      const data = JSON.parse(message.data);
      if (data.type === 'msg') {
        this.setState(prevState => ({messages: [...prevState.messages, data.content]}));
      }
    };
  }

  newMsg = event => {
    event.preventDefault();
    const msg = event.target[1].value;
    this.setState(prevState => {
      client.send(JSON.stringify({
        type: 'newMsg',
        username: 'user1',
        content: msg
      }));
      return {
        messages: [...prevState.messages, {content: msg}],
        inputText: ''
      };
    });
  }

  textInputUpdate = event => {
    const newVal = event.target.value;
    this.setState({inputText: newVal});
  }

  render() {
    return (
      <div className="App">
        <Container maxWidth="sm">
          <Paper style={{minHeight: '400px', paddingTop: '20px'}}>
            {this.state.messages.map(msg => (
              <p key={msg.id}>{msg.content}</p>
            ))}
          </Paper>
          <form onSubmit={this.newMsg}>
            <TextField
              label=''
              style={{ margin: 8 }}
              placeholder=""
              helperText=''
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.inputText}
              onChange={this.textInputUpdate}
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
          <h3>rooms</h3>
          <List subheader={<li />}>
            {this.state.rooms.map(room => (
              <ListItem button key={room.name}>
                <ListItemText primary={room.name} />
              </ListItem>
            ))}
          </List>
        </Container>
      </div>
    );
  }
}

export default App;
