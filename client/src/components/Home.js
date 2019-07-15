import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <p>
          Welcome to BLAH BLAH! Here's how this works...
          You choose a room and create a username when you get there,
          then you have to get a like within 60 seconds in order to stay.
          So bring some good contributions to the table and you'll be able
          to enjoy the conversation, if you don't, you'll be kicked out.
        </p>
        <List subheader={<li />}>
          {this.props.rooms.map(room => (
            <ListItem button key={room} onClick={() => this.props.setRoom(room)}>
              <ListItemText primary={room} />
            </ListItem>
          ))}
        </List>
        <br />
        <h5>add a new room</h5>
        <form onSubmit={this.props.newRoom}>
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
            value={this.props.roomInput}
            onChange={this.props.roomInputUpdate}
          />
          <Button type="submit" variant="contained" color="primary">Send</Button>
        </form>
      </div>
    );
  }
}

export default Home;
