import React from 'react';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

class Room extends React.Component {
  render() {
    return (
      <div className="Home">
        <Container maxWidth="sm">
          <Button type="submit" variant="contained" onClick={() => this.props.setRoom('')} color="primary">Leave</Button>
          <h3>welcome to {this.props.room.name}!</h3>
          <Paper style={{minHeight: '400px', paddingTop: '20px'}}>
            {this.props.messages.map(message => (
              <p key={message._id}>{`${message.user}: ${message.content}`}</p>
            ))}
          </Paper>
          <form onSubmit={this.props.newMessage}>
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
              value={this.props.messageInput}
              onChange={this.props.messageInputUpdate}
            />
            <Button type="submit" variant="contained" color="primary">Send</Button>
          </form>
        </Container>
      </div>
    );
  }
}

export default Room;
