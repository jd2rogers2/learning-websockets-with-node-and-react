import React from 'react';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

class Room extends React.Component<IRoomProps, IRoomState> {
  constructor(props: IRoomProps) {
    super(props);
    this.state = {
      user: '',
      isModalOpen: true,
      userInput: '',
      usernameExists: false
    };
  }

  setUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.props.messages.map(msg => msg.user).includes(this.state.userInput)) {
      this.setState({
        usernameExists: true
      });
    } else {
      this.setState({
        user: this.state.userInput,
        isModalOpen: false,
        userInput: ''
      });
      this.kickout();
    }
  }

  kickout = () => {
    setTimeout(() => {
      const usersLikedMessages = this.props.messages.filter(msg => msg.liked && msg.user === this.state.user);
      if (!usersLikedMessages.length) {
        this.setState({
          user: '',
          userInput: '',
          isModalOpen: true
        })
        console.log("no likes, goodbye");
        this.props.setRoom('');
      }
    }, 60000);
  }

  userInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;
    this.setState({userInput: newVal});
  }

  likeMessage = (message: IMessage) => {
    if (this.state.user !== message.user && !message.liked) {
      this.props.likeMessage(message);
    }
  }

  render() {
    return (
      <div className="Home">
        <Modal
          style={{backgroundColor: 'white', paddingTop: '200px', width: '75%', margin: 'auto'}}
          aria-labelledby="create-new-user"
          aria-describedby="create a new user"
          open={this.state.isModalOpen}
        >
          <form onSubmit={this.setUser}>
            {this.state.usernameExists && (<p style={{color: 'red'}}>username already exists</p>)}
            <TextField
              label=''
              style={{ margin: 8 }}
              helperText=''
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.userInput}
              onChange={this.userInputUpdate}
              placeholder="new user"
            />
            <Button type="submit" variant="contained" color="primary">send</Button>
          </form>
        </Modal>
        <Container maxWidth="sm">
          <Button type="submit" variant="contained" onClick={() => this.props.setRoom('')} color="primary">Leave</Button>
          <h3>welcome to {this.props.room}!</h3>
          <Paper style={{minHeight: '400px', paddingTop: '20px'}}>
            <List>
              {this.props.messages.map(message => {
                const isCurrentUser = message.user === this.state.user;
                return (
                  <ListItem className={isCurrentUser ? "isCurrentUser" : ""} key={message._id}>
                    {!isCurrentUser && (
                      <IconButton aria-label="Delete" onClick={() => this.likeMessage(message)}>
                        <Icon color={message.liked ? "primary" : "action"} fontSize="small">thumb_up</Icon>
                      </IconButton>
                    )}
                    <ListItemText primary={<React.Fragment><span className={isCurrentUser ? "isCurrentUser" : "isNotCurrentUser"}>{message.user}</span>: {message.content}</React.Fragment>} />
                    {isCurrentUser && (
                      <IconButton aria-label="Delete" onClick={() => this.likeMessage(message)}>
                        <Icon color={message.liked ? "primary" : "action"} fontSize="small">thumb_up</Icon>
                      </IconButton>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Paper>
          <form onSubmit={e => this.props.newMessage(e, this.state.user)}>
            <TextField
              label=''
              style={{ margin: 8 }}
              helperText=''
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.props.messageInput}
              onChange={this.props.messageInputUpdate}
              placeholder="new message"
            />
            <Button type="submit" variant="contained" color="primary">Send</Button>
          </form>
        </Container>
      </div>
    );
  }
}

export default Room;
