import React from 'react';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { w3cwebsocket } from "websocket";

const client = new w3cwebsocket('ws://127.0.0.1:8000');

class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // {content: "hi", user_id: 1, id: 1}
      // {username: "user1", room_id: 1, id: 1}
      messages: [{content: "hi", user_id: 1, _id: 1}],
      // users: [{name: 'joeyj', _id: 1}],
      inputText: ''
    };
  }

  componentWillMount() {
    // this.getMessages();

    // below doesn't run anymore?
    client.onopen = () => {
      console.log('websockets running');
    };

    client.onmessage = resp => {
      const data = JSON.parse(resp.data);
      if (data.type === 'newMsg') {
        this.setState(prevState => ({
          messages: [...prevState.messages, data.message],
          inputText: ''
        }));
      }
    };
  }

  newMsg = event => {
    event.preventDefault();
    client.send(JSON.stringify({
      type: 'newMsg',
      // userId: 1,
      content: event.target[1].value
    }));
  }

  textInputUpdate = event => {
    const newVal = event.target.value;
    this.setState({inputText: newVal});
  }

  getMessages = () => {
    fetch('localhost:8000/messages?room_id=' + this.props.roomId, {
      accept: 'application/json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    }).then(response => response.json()).then(data => {
      debugger;
      this.setState({messages: data});
    });
  };


  render() {
    return (
      <div className="Home">
        <Container maxWidth="sm">
          <Paper style={{minHeight: '400px', paddingTop: '20px'}}>
            {this.state.messages.map(msg => (
              <p key={msg._id}>{msg.content}</p>
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
        </Container>
      </div>
    );
  }
}

export default Room;
